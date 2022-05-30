import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
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


export default class lWCSearchForOptOnAccountPage extends LightningElement {
    columns = COLUMNS;
    opportunities;
    clicked = false;
    listEmpty = true;
    accountName;
    // prefill the searchbox for ease of use
    keyword = "Acme";
    
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

    getSelectedName(event) {
        const row = event.detail.row;
        // Display that fieldName of the selected row
        const url = '/' + row.Id;
        window.open(url,"_self");
    }

}