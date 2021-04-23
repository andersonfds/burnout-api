import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '@src/resources/user/entities/user.entity';

export interface MessageOptions {
    /**
     * The notification channel to receive the message
     */
    action: string;

    /**
     * The data to be sent
     */
    data: any;
}

export interface NotificationOptions {
    /**
     * The title of the notification
     */
    title: string;

    /**
     * The body of the notification
     */
    body: string;
}

interface FirebaseGroupOptions {
    operation: string;
    notification_key_name: string;
    notification_key: string;
    registration_ids: string[];
}

@Injectable()
export class FcmService {

    constructor(private http: HttpService, private config: ConfigService) {
        // configuration variables
        const baseUrl = this.config.get<string>('FIREBASE_URL');
        const apiKey = 'Key=' + this.config.get<string>('FIREBASE_KEY');
        const senderId = this.config.get<string>('FIREBASE_SENDER_ID');
        const content = 'application/json';

        // adding a request interceptor
        this.http.axiosRef.interceptors.request.use((request) => {
            request.baseURL = baseUrl;
            request.headers['accept'] = content;
            request.headers['project_id'] = senderId;
            request.headers['content-type'] = content;
            request.headers['authorization'] = apiKey;
            return request;
        });
    }

    /**
     * This function notify the user that some data has changed
     * the user will receive a data notification which is very likely
     * the rabbitMq way, the user needs to be registered first
     * @param user The user that will receive the dataa
     * @param messageOptions The data to be sent
     */
    async notifyChannel(user: UserEntity, options: MessageOptions) {
    }

    /**
     * Sends notification to a registered user via group
     * the user must be registered first
     * @param user The user to receive notification
     * @param notification the Notification itself
     */
    async notify(user: UserEntity, options: NotificationOptions) {
    }

    /**
     * Registers a user's device to be able to send notification to them
     * via a group channel if the group does not exists we shall create it
     * @param user The User Entity to be registered
     * @param token The User's token
     */
    async register(user: UserEntity, token: string) {
        const success = await this.createOrAdd(user.notificationId, user.id, token);
        if (!success) {
            try {
                const response = await this.http.get('notification', {
                    params: { notification_key_name: user.id }
                }).toPromise();

                if (response.status == 200) {
                    user.notificationId = response.data.notification_key;
                    await user.save();
                    await this.createOrAdd(user.notificationId, user.id, token);
                    return true;
                }
            } catch (error) {
                return false;
            }
        }
        return false;
    }

    /**
     * Creates or adds the provided user to the group
     * @param notificationId The id of the notification
     * @param name the key of the notification
     * @param token the device token
     * @returns true if registered successfully
     */
    async createOrAdd(notificationId: string, name: string, token: string): Promise<boolean> {

        try {
            const operation = notificationId == null ? 'create' : 'add';

            const data = <FirebaseGroupOptions>{
                operation,
                notification_key_name: name,
                notification_key: notificationId,
                registration_ids: [token],
            };

            await this.http.post('notification', { data }).toPromise();
            return true;
        } catch (e) {
            return false;
        }
    }

}
