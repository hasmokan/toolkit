# @hasmokan/alicloud-sms

`@hasmokan/alicloud-sms` is an SDK for Alibaba Cloud SMS service, providing functionalities for sending SMS and querying SMS sending details.

## Installation

Install the dependency using npm or pnpm:

```sh
npm install @hasmokan/alicloud-sms
```

or

```sh
pnpm add @hasmokan/alicloud-sms
```

## Usage

### Initialization

Before using the SDK, you need to initialize the Alibaba Cloud SMS client.

```typescript
import { AliCloudSms, SendSmsParams } from '@hasmokan/alicloud-sms';

const smsClient = new AliCloudSms();
```

### Sending SMS

Use the `sendSms` method to send an SMS. You need to pass a `SendSmsParams` object containing the relevant parameters for sending the SMS.

```typescript
const params: SendSmsParams = {
  phoneNumbers: '182xxxx5xx9',
  signName: 'CodeAeg1sNotification',
  templateCode: 'SMS_474855932',
  templateParam: '{code: 123456}',
};

smsClient.sendSms(params).then((result) => {
  if (result instanceof Error) {
    console.error('Failed to send:', result.message);
  } else {
    console.log('Successfully sent, bizId:', result);
  }
});
```

### Querying SMS Sending Details

Use the `querySendDetails` method to query the details of the sent SMS. You need to pass an array of phone numbers and the `bizId`.

```typescript
const phoneNumbers = ['182xxxx5xx9'];
const bizId = 'your-biz-id';

smsClient.querySendDetails(phoneNumbers, bizId).then((results) => {
  results.forEach((result) => {
    result
      .then((message) => {
        console.log(message);
      })
      .catch((error) => {
        console.error(error);
      });
  });
});
```

## Configuration

When initializing `AliCloudSms`, the default Alibaba Cloud credential configuration will be loaded automatically. If you need custom configuration, you can pass the corresponding parameters in the `constructor`.

## Contribution

Feel free to submit issues and contribute code.

## License

[ISC](LICENSE)