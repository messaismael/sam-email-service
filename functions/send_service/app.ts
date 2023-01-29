import sendMessageService from './service';
import { Context, APIGatewayEvent } from 'aws-lambda';
import { SendData } from './sqs';

const handler = async function (event: APIGatewayEvent, context: Context) {
    const body = JSON.parse((event.body as string) || '{}') as SendData;

    try {
        const res = await sendMessageService(body);
        return res;
    } catch (err) {
        return err;
    }
};
export { handler };
