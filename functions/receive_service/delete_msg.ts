import { SQS } from 'aws-sdk';
import { DeleteMessageRequest } from 'aws-sdk/clients/sqs';
import { QUEUE_URL } from './config';

const sqs = new SQS({ region: 'us-east-1' });

const deleteMessage = async (receiptHandle: string) => {
    const params: DeleteMessageRequest = {
        QueueUrl: QUEUE_URL,
        ReceiptHandle: receiptHandle,
    };

    return sqs.deleteMessage(params).promise();
};

export default deleteMessage;
