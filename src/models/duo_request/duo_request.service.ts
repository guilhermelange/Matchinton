import { Injectable, HttpException } from '@nestjs/common';
import { CreateDuoRequestDto } from './dto/create-duo_request.dto';
import { UpdateDuoRequestDto } from './dto/update-duo_request.dto';
import { PrismaService, RequestStatus, requesttype } from '../../database/prisma';

@Injectable()
export class DuoRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDuoRequestDto: CreateDuoRequestDto) {
    this.validaRequestExistente(createDuoRequestDto);
    this.validaTypeRequest(createDuoRequestDto);
    this.validaExistente(createDuoRequestDto);
    
    const newDuoRequest = await this.prisma.duo_request.create({
      data: {
        player1: createDuoRequestDto.player1,
        player2: createDuoRequestDto.player2,
        competition_id: createDuoRequestDto.competition,
        status: RequestStatus.PENDING
      }
    });

    return newDuoRequest;
  }

  async update(updateDuoRequestDto: UpdateDuoRequestDto) {
    //- Localizar registro pelo ID que vai chegar
    const duoRequest = await this.prisma.duo_request.findFirst({
      where: {
        id: updateDuoRequestDto.id
      }
    });

    if (!duoRequest) {
      throw new HttpException('Requisição não encontrada', 400);
    }

    //- Comparar o autenticação com os users do request. Se você solicitou: ('CANCELAR'). Se é a outra pessoa: ('ACEITAR', 'RECUSAR')
    if (updateDuoRequestDto.status == RequestStatus.CANCELED) {
      if (updateDuoRequestDto.player != duoRequest.player1) {
        throw new HttpException('Apenas o jogador solicitante pode cancelar.', 400);
      }
    } else if (updateDuoRequestDto.player == duoRequest.player1) {
      throw new HttpException('Apenas o jogador solicitado pode aceitar/recusar.', 400);
    }

    //- Sempre que aceitar:
        //- Buscar por competição, pra cada um dos jogadores, e 'DESCONSIDERAR' todos em que eles estão como userorigem ou userdestino
    if (updateDuoRequestDto.status == RequestStatus.ACCEPTED) {
        await this.prisma.duo_request.updateMany({
        where: {
          OR: [
            {player1: duoRequest.player1},
            {player1: duoRequest.player2},
            {player2: duoRequest.player1},
            {player2: duoRequest.player2}
          ],
          competition_id: duoRequest.competition_id,
          status: RequestStatus.PENDING
        },
        data: {
          status: RequestStatus.DISREGARDED,
        },
      })
    }

    return duoRequest;
  }
  
  /**
   * Valida se já não existe uma request aceita para os players na competição
   * @param createDuoRequestDto 
   */
  private async validaRequestExistente(createDuoRequestDto: CreateDuoRequestDto) {
    //- Bloquear se o usuário origem ou destino tiver na mesma competição um aceito
    let duo_request = await this.prisma.duo_request.findFirst({
      where: {
        OR: [
          {player1: createDuoRequestDto.player1},
          {player2: createDuoRequestDto.player1}
        ],
        competition_id: createDuoRequestDto.competition,
        status: RequestStatus.ACCEPTED
      },
    });

    if (duo_request) {
      throw new HttpException('O jogador 1 já possui uma dupla para a competição', 400);
    }

    duo_request = await this.prisma.duo_request.findFirst({
      where: {
        OR: [
          {player1: createDuoRequestDto.player2},
          {player2: createDuoRequestDto.player2}
        ],
        competition_id: createDuoRequestDto.competition,
        status: RequestStatus.ACCEPTED
      },
    });

    if (duo_request) {
      throw new HttpException('O jogador 2 já possui uma dupla para a competição', 400);
    }
  }
  
  /**
   * Valida o gênero
   * @param createDuoRequestDto
   */
  private async validaTypeRequest(createDuoRequestDto: CreateDuoRequestDto) {
    //- Calcular o Type do Request, e validar se a competição permite
    const competition = await this.prisma.competition.findFirst({
      where: {
        id: createDuoRequestDto.competition
      }
    });

    const player1 = await this.prisma.player.findFirst({
      where: {
        id: createDuoRequestDto.player1
      }
    });

    const player2 = await this.prisma.player.findFirst({
      where: {
        id: createDuoRequestDto.player2
      }
    });

    if (competition.type == requesttype.MIS) {
      if (player1.gender == player2.gender) {
        throw new HttpException('O gênero dos jogadores devem ser diferentes.', 400);
      }
    } else {
      if (player1.gender != player2.gender) {
        throw new HttpException('O gênero dos jogadores devem ser iguais.', 400);
      }
    }
  }

  /**
   * Valida se já não existe uma requisição igual
   * @param createDuoRequestDto 
   */
  private async validaExistente(createDuoRequestDto: CreateDuoRequestDto) {
    //- Validar se já não existe. (competição, userorigem, userdestino)
    const duoRequestDuplicated = await this.prisma.duo_request.findFirst({
      where: {
        player1: createDuoRequestDto.player1,
        player2: createDuoRequestDto.player2,
        competition_id: createDuoRequestDto.competition
      }
    });

    if (duoRequestDuplicated) {
      throw new HttpException('Já existe uma solicitação feita.', 400);
    }
  }

}