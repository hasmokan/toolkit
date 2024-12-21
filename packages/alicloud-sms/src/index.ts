import Dysmsapi, * as $Dysmsapi from '@alicloud/dysmsapi20170525';
import * as $OpenApi from '@alicloud/openapi-client';
import Util from '@alicloud/tea-util';
import Time from '@darabonba/time';
import Credential from '@alicloud/credentials';

/**
 * @description 发送短信参数
 * @see 阿里云文档 https://help.aliyun.com/zh/sdk/developer-reference/v2-manage-node-js-access-credentials
 */
export interface SendSmsParams {
  /**
   * 需要发送的号码.
   * @example '182xxxx5xx9'
   */
  phoneNumbers: string;
  /**
   *  签名名称.
   *  @example 'CodeAeg1s通知'
   */
  signName: string;
  /**
   * 短信模板.
   * @example 'SMS_474855932'
   */
  templateCode: string;
  /**
   * 模板参数.
   * @example '{code: 123456}'
   */
  templateParam: string;
}

export class AliCloudSms {
  private config: $OpenApi.Config;
  private client: Dysmsapi;

  constructor() {
    const credentialClient = new Credential();
    this.config = new $OpenApi.Config({});
    this.config.credential = credentialClient;
    this.client = new Dysmsapi(this.config);
  }

  public async sendSms(
    args: SendSmsParams
  ): Promise<string | Error> {
    const sendReq = new $Dysmsapi.SendSmsRequest({
      phoneNumbers: args.phoneNumbers,
      signName: args.signName,
      templateCode: args.templateCode,
      templateParam: args.templateParam,
    });

    try {
      const sendResp = await this.client.sendSms(sendReq);

      if (!sendResp?.body?.code)
        throw new Error('发送失败：未收到响应的错误代码');

      if (!sendResp?.body?.bizId)
        throw new Error('发送失败：未收到 bizId');

      const code = sendResp.body.code;
      if (code !== 'OK') {
        throw new Error(`发送失败：${sendResp.body.message}`);
      }

      return sendResp.body.bizId;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(`发送短信失败：${error.message}`);
      }
      return new Error('发送短信失败：未知错误');
    }
  }

  public async querySendDetails(
    phoneNums: string[],
    bizId: string
  ): Promise<Promise<string>[]> {
    const result: Promise<string>[] = [];
    for (const phoneNum of phoneNums) {
      const queryReq = new $Dysmsapi.QuerySendDetailsRequest({
        phoneNumber: Util.assertAsString(phoneNum),
        bizId: bizId,
        sendDate: Time.format('yyyyMMdd'),
        pageSize: 10,
        currentPage: 1,
      });
      const queryResp = await this.client.querySendDetails(queryReq);

      if (!queryResp?.body?.smsSendDetailDTOs?.smsSendDetailDTO) {
        result.push(Promise.reject('未查询到发送记录'));
        continue;
      }
      const dtos = queryResp.body.smsSendDetailDTOs.smsSendDetailDTO;

      // 打印结果
      dtos.forEach((dto) => {
        if (Util.equalString(`${dto.sendStatus}`, '3')) {
          result.push(
            Promise.resolve(
              `${dto.phoneNum} 发送成功，接收时间: ${dto.receiveDate}`
            )
          );
        } else if (Util.equalString(`${dto.sendStatus}`, '2')) {
          result.push(Promise.reject(`${dto.phoneNum} 发送失败`));
        } else {
          result.push(Promise.resolve(`${dto.phoneNum} 正在发送中...`));
        }
      });
    }

    return result;
  }
}



