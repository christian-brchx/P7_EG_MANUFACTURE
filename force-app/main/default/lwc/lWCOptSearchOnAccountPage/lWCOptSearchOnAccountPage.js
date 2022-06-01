import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import getOpportunities from '@salesforce/apex/APXOptSearchOnAccountPage.getOpportunities';

const actions = [
    { label: 'Show details', name: 'show_details' }
];

const COLUMNS = [
    { type: 'action', typeAttributes: { rowActions: actions, menuAlignment: 'left' } },
    { label: 'Nom', fieldName: 'Name', type : 'text' },
    { label: 'Etape', fieldName: 'StageName', type : 'text' },
    { label: 'Montant', fieldName: 'Amount', type : 'currency' },
    { label: 'Date de clôture', fieldName: 'CloseDate', type : 'date' }
];

export default class lWCOptSearchOnAccountPage extends NavigationMixin(LightningElement) {
    columns = COLUMNS;
    //opportunities = OPPORTUNITIES;
    opportunities;
    clicked = false;
    listEmpty = true;
    accountName;
    // prefill the searchbox for ease of use
    keyword = "Acme";
    idOpportunity;
    
    // Récupération de l'enregistrement account
    @api recordId;
    @wire(getRecord, { recordId: '$recordId', fields: [NAME_FIELD] })
    wiredRecord({ error, data }) {
        if (data) {
            this.accountName = getFieldValue(data, NAME_FIELD);
            console.log("OptSearchOnAccountPage wiredRecord data, NAME_FIELD =", this.accountName);
            console.log("recordId = ",this.recordId);
        } else if (error) {
            console.log("NewUpdateLeadStatus wiredRecord error");
            // Handle error. Details in error.message.
        }
    }

    handleInputChange(event) {
        this.keyword = event.detail.value;
    }

    search(event) {
        console.log("Entrée search target event = ",event.target.label);
        console.log("Entrée search accountName = ",this.accountName);
        console.log("Entrée search keysearch = ",this.keyword);
        console.log("Entrée search accountId = ",this.recordId);
        this.clicked = true;

        getOpportunities({accountId: this.recordId, keyword: this.keyword})
        .then(result => {
            this.opportunities = result;
            if (this.opportunities.length > 0) {
                this.listEmpty = false;
            }
            else {
                this.listEmpty = true;
            }
            console.log("result call getOpportunities : ", this.opportunities);
            this.clicked = false;
        })
        .catch(error => {
            // Handle error. Details in error.message.
            console.log("Error call getOpportunities : ", error);
            this.clicked = false;
        });

    }

    blockClicked(event) {
        //The id of the box in the DOM contains the opportunity Id (with a suffix)
        if (event.target.className.substring(0,8) == "slds-box") {
            // Click on the box.
            // We get the id of the element clicked (the box) and save it in the property.
            this.idOpportunity = event.target.id.substring(0,18);
        } else {
            // click on a box's field. 
            // We have to get the id of the element's parent (the box).
            this.idOpportunity = event.target.parentElement.id.substring(0,18);
        }

        console.log("id = ",this.idOpportunity);

        this[NavigationMixin.GenerateUrl]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.idOpportunity,
                actionName: 'view',
            },
        }).then((url) => {
            window.open(url,"_self");
        });
    }
}