import { SES, AWSError } from 'aws-sdk';
import { SendEmailRequest } from 'aws-sdk/clients/ses';
import { PromiseResult } from 'aws-sdk/lib/request';
import { TO_EMAILS } from '../config';

const ses = new SES({ region: 'us-east-1' });

type FormData = {
    emailFrom: string;
    message: string;
    name: string;
};

/**
 * @name sesSend
 * @param {FormData}
 * @returns {Promise{*}}
 * @author Ismael Messa
 */
const sendEmail = (formData: FormData): Promise<PromiseResult<SES.SendEmailResponse, AWSError>> => {
    const { emailFrom, message, name } = formData;

    const params: SendEmailRequest = {
        Destination: {
            ToAddresses: TO_EMAILS,
        },
        Message: {
            Body: {
                Text: { Data: `From Contact: ${name} \n\n\n ${message}` },
            },
            Subject: { Data: 'Contacted from the email sending service' },
        },
        Source: emailFrom,
    };

    return ses.sendEmail(params).promise();
};

export default sendEmail;
