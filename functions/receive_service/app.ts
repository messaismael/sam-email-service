import AWS from 'aws-sdk';
import { Context, APIGatewayEvent } from 'aws-lambda';

import { TABLE_NAME } from './config';
import sendEmail from './ses';
import deleteMessage from './delete_msg';

const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const handler = async function (event: APIGatewayEvent, context: Context) {
    console.log('event', event);
    const { Records } = event;

    for (let i = 0; i < Records.length; i++) {
        const record = Records[i];

        const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
            TableName: TABLE_NAME,
            Key: {
                messageId: record.messageId,
            },
        };

        const msgStatus = await dynamoDb.get(params).promise();
        console.log('message Status', msgStatus);

        if (msgStatus.Item && msgStatus.Item.emailSended == 'false') {
            const formData = JSON.parse(record.body || '{}');

            try {
                await sendEmail(formData);
                console.log('Success', { message: 'Email sended' });

                msgStatus.Item.emailSended = 'true';
                const putParams: AWS.DynamoDB.DocumentClient.PutItemInput = {
                    TableName: TABLE_NAME,
                    Item: { ...msgStatus.Item },
                };
                await dynamoDb.put(putParams).promise();

                try {
                    await deleteMessage(record.receiptHandle);
                    console.log('Success', { message: 'Message removed from queue' });
                } catch (err) {
                    console.error('error deleting message', err);
                }
            } catch (err) {
                console.error('error sending via ses', err);
            }
        }
    }

    return { Status: 'finished', success: true };
};

export { handler };
