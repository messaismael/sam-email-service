/**
 * Config file
 * @author Ismael Messa
 */

export const TO_EMAILS = (process.env.TO_EMAILS || '').split(',');

export const QUEUE_URL = process.env.QUEUE_URL || '';

export const TABLE_NAME = process.env.TABLE_NAME || '';
