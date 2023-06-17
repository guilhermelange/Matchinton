import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateWhatDto } from './dto/create-what.dto';
import { Whatsapp, create } from 'venom-bot';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

@Injectable()
export class WhatsService {
  private client: Whatsapp;

  constructor() {
    // this.initialize();
  }

  private initialize() {
    const qr = (base64Qrimg: string) => {
      console.log('qr: ' + base64Qrimg);
    };

    const status = (statusSession: string) => {
      console.log('status: ' + statusSession);
    };

    const start = (client: Whatsapp) => {
      this.client = client;
    };

    create('ws-sender-dev', qr, status)
      .then((client) => start(client))
      .catch((error) => console.log(error));
  }

  async send(createWhatDto: CreateWhatDto) {
    try {
      if (!isValidPhoneNumber(createWhatDto.to, 'BR')) {
        throw new BadRequestException('Telefone inválido');
      }
      let fone = parsePhoneNumber(createWhatDto.to, 'BR')
        ?.format('E.164')
        ?.replace('+', '');

      if (!fone.endsWith('@c.us')) {
        fone += '@c.us';
      }
      await this.client.sendText(fone, createWhatDto.text);
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Erro ao enviar mensagem',
      );
    }

    return '';
  }
}
