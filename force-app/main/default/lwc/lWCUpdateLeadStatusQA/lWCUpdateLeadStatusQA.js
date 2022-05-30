import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';
import STATUS_FIELD from '@salesforce/schema/Lead.Status';
import ID_FIELD from '@salesforce/schema/Lead.Id';


export default class LWCUpdateLeadStatusQA extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields: [ STATUS_FIELD ] })
    wiredRecord({ error, data }) {
        if (data) {
            //console.log("LWCUpdateLeadStatusQA wiredRecord data, STATUS_FIELD",getFieldValue(data, STATUS_FIELD));
        } else if (error) {
            console.log("LWCUpdateLeadStatusQA wiredRecord error");
            // Handle error. Details in error.message.
        }
    }

    @api invoke() {
        console.log("Entrée dans Invoke");

        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.recordId;
        fields[STATUS_FIELD.fieldApiName] = "Intéressé(e)";
        const recordInput = { fields };
        updateRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Lead Status updated',
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

    }

}