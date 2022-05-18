import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';
//import LEAD_OBJECT from '@salesforce/schema/Lead';
import NAME_FIELD from '@salesforce/schema/Lead.Name';
import STATUS_FIELD from '@salesforce/schema/Lead.Status';
import ID_FIELD from '@salesforce/schema/Lead.Id';


export default class NewUpdateLeadStatus extends LightningElement {
    clicked = false;
    @api recordId;
    leadName;
    leadStatus;
    leadId;
    @wire(getRecord, { recordId: '$recordId', fields: [NAME_FIELD , STATUS_FIELD] })
    wiredRecord({ error, data }) {
        if (data) {
            this.leadName = getFieldValue(data, NAME_FIELD);
            console.log("NewUpdateLeadStatus wiredRecord data, NAME_FIELD =", this.leadName);
            this.leadStatus = getFieldValue(data, STATUS_FIELD);
            console.log("NewUpdateLeadStatus wiredRecord data, STATUS_FIELD",this.LeadStatus);
        } else if (error) {
            console.log("NewUpdateLeadStatus wiredRecord error");
            // Handle error. Details in error.message.
        }
    }
    onClick(event) {
        console.log("Entrée onclick target event = ",event.target.label);
        console.log("Entrée onclick LeadName = ",this.leadName);
        console.log("Entrée onclick LeadStatus = ",this.leadStatus);
        this.clicked = true;
        this.leadStatus = "Intéressé(e)";

        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.recordId;
        //fields[NAME_FIELD.fieldApiName] = this.leadName;
        fields[STATUS_FIELD.fieldApiName] = this.leadStatus;
        const recordInput = { fields };
        updateRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Contact updated',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });

        console.log("Sortie onclick");
        setTimeout(() => {
            this.clicked = false;
        }, 3000);
    }
    connectedCallback() {
        console.log("ConnectedCallback");
    }
}