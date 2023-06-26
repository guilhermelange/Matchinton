import { Injectable, HttpException } from '@nestjs/common';
import { CreateDuoRequestDto } from './dto/create-duo_request.dto';
import { UpdateDuoRequestDto } from './dto/update-duo_request.dto';
import {
  PrismaService,
  RequestStatus,
  requesttype,
} from '../../database/prisma';
import { EmailService } from '../email/email.service';
import { EMAIL_SUBSCRIPTION } from '../../common/constant';

@Injectable()
export class DuoRequestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async findAll(params) {
    const { competition_id, player1, player2, player, team_id, status } =
      params;

    const statusFilter = status as RequestStatus;

    let queryFilter = {
      competition_id: competition_id,
      player1: player1,
      player2: player2,
    } as any;

    if (player) {
      queryFilter = {
        ...queryFilter,
        OR: [{ player1: player }, { player2: player }],
      };
    }

    if (statusFilter) {
      queryFilter = {
        ...queryFilter,
        status: statusFilter,
      };
    }

    if (team_id) {
      queryFilter = {
        ...queryFilter,
        OR: [
          {
            player_origin: {
              team_id: team_id,
            },
          },
          {
            player_target: {
              team_id: team_id,
            },
          },
        ],
      };
    }

    return await this.prisma.duo_request.findMany({
      where: queryFilter,
      select: {
        id: true,
        player_origin: {
          select: {
            id: true,
            name: true,
            gender: true,
            birth_date: true,
            city: true,
            state: true,
            photo: true,
            team_id: true,
            team: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        player_target: {
          select: {
            id: true,
            name: true,
            gender: true,
            birth_date: true,
            city: true,
            state: true,
            photo: true,
            team_id: true,
            team: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        competition: true,
        status: true,
      },
    });
  }

  async findOne(id: number) {
    const duoRequest = await this.prisma.duo_request.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        player_origin: {
          select: {
            id: true,
            name: true,
            gender: true,
            team: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        player_target: {
          select: {
            id: true,
            name: true,
            gender: true,
            team: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        competition: true,
        status: true,
      },
    });

    if (!duoRequest) {
      throw new HttpException('Requisição não encontrada', 400);
    }
    return duoRequest;
  }

  async create(createDuoRequestDto: CreateDuoRequestDto) {
    await this.validaRequestExistente(createDuoRequestDto);
    await this.validaTypeRequest(createDuoRequestDto);
    await this.validaExistente(createDuoRequestDto);

    const newDuoRequest = await this.prisma.duo_request.create({
      data: {
        player1: createDuoRequestDto.player1,
        player2: createDuoRequestDto.player2,
        competition_id: createDuoRequestDto.competition,
        status: RequestStatus.PENDING,
      },
    });

    return newDuoRequest;
  }

  async update(updateDuoRequestDto: UpdateDuoRequestDto, id: number) {
    //- Localizar registro pelo ID que vai chegar
    const duoRequest = await this.prisma.duo_request.findFirst({
      where: {
        id,
      },
      include: {
        player_origin: {
          select: {
            team_id: true,
            name: true,
          },
        },
        player_target: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!duoRequest) {
      throw new HttpException('Requisição não encontrada', 400);
    }

    const imutableStatus = [
      RequestStatus.DISREGARDED,
      RequestStatus.CANCELED,
    ] as RequestStatus[];
    //- Comparar o autenticação com os users do request. Se você solicitou: ('CANCELAR'). Se é a outra pessoa: ('ACEITAR', 'RECUSAR')
    if (updateDuoRequestDto.status == RequestStatus.CANCELED) {
      if (updateDuoRequestDto.player != duoRequest.player1) {
        throw new HttpException(
          'Apenas o jogador solicitante pode cancelar.',
          400,
        );
      }
    } else if (updateDuoRequestDto.player == duoRequest.player1) {
      throw new HttpException(
        'Apenas o jogador solicitado pode aceitar/recusar.',
        400,
      );
    } else if (
      updateDuoRequestDto.player == duoRequest.player2 &&
      imutableStatus.includes(duoRequest.status)
    ) {
      throw new HttpException('Não permitida alteração quando CANCELADO', 400);
    }

    if (updateDuoRequestDto.status == RequestStatus.ACCEPTED) {
      //- Sempre que aceitar:
      //- Buscar por competição, pra cada um dos jogadores, e 'DESCONSIDERAR' todos em que eles estão como userorigem ou userdestino
      await this.prisma.duo_request.updateMany({
        where: {
          OR: [
            { player1: duoRequest.player1 },
            { player1: duoRequest.player2 },
            { player2: duoRequest.player1 },
            { player2: duoRequest.player2 },
          ],
          competition_id: duoRequest.competition_id,
          status: RequestStatus.PENDING,
          id: { not: id },
        },
        data: {
          status: RequestStatus.DISREGARDED,
        },
      });
    }

    const changeStatus = [
      RequestStatus.ACCEPTED,
      RequestStatus.DENIED,
    ] as RequestStatus[];

    if (changeStatus.includes(updateDuoRequestDto.status)) {
      const usersTeam = await this.prisma.team.findUnique({
        where: {
          id: duoRequest.player_origin.team_id,
        },
        select: {
          name: true,
          user: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      });

      const statusText =
        updateDuoRequestDto.status == RequestStatus.ACCEPTED
          ? '<span style="color: green; font-weight: bold;">Aceita</span>'
          : '<span style="color: red; font-weight: bold;">Rejeitada</span>';

      this.emailService.send({
        to: usersTeam.user.email,
        subject: 'Alteração de Status de Requisição',
        message: `Olá <strong>${usersTeam.user.name}</strong><br><br>&nbsp;&nbsp;A requisição realizada de <strong>${duoRequest.player_origin.name}</strong> para <strong>${duoRequest.player_target.name}</strong> foi ${statusText}!${EMAIL_SUBSCRIPTION}`,
      });
    }

    return await this.prisma.duo_request.update({
      where: {
        id,
      },
      data: {
        status: updateDuoRequestDto.status,
      },
    });
  }

  /**
   * Valida se já não existe uma request aceita para os players na competição
   * @param createDuoRequestDto
   */
  private async validaRequestExistente(
    createDuoRequestDto: CreateDuoRequestDto,
  ) {
    //- Bloquear se o usuário origem ou destino tiver na mesma competição um aceito
    let duo_request = await this.prisma.duo_request.findFirst({
      where: {
        OR: [
          { player1: createDuoRequestDto.player1 },
          { player2: createDuoRequestDto.player1 },
        ],
        competition_id: createDuoRequestDto.competition,
        status: RequestStatus.ACCEPTED,
      },
    });

    if (duo_request) {
      throw new HttpException(
        'O jogador 1 já possui uma dupla para a competição',
        400,
      );
    }

    duo_request = await this.prisma.duo_request.findFirst({
      where: {
        OR: [
          { player1: createDuoRequestDto.player2 },
          { player2: createDuoRequestDto.player2 },
        ],
        competition_id: createDuoRequestDto.competition,
        status: RequestStatus.ACCEPTED,
      },
    });

    if (duo_request) {
      throw new HttpException(
        'O jogador 2 já possui uma dupla para a competição',
        400,
      );
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
        id: createDuoRequestDto.competition,
      },
    });

    const player1 = await this.prisma.player.findFirst({
      where: {
        id: createDuoRequestDto.player1,
      },
    });

    const player2 = await this.prisma.player.findFirst({
      where: {
        id: createDuoRequestDto.player2,
      },
    });

    if (competition.type == requesttype.MIS) {
      if (player1.gender == player2.gender) {
        throw new HttpException(
          'O gênero dos jogadores devem ser diferentes.',
          400,
        );
      }
    } else {
      if (player1.gender != player2.gender) {
        throw new HttpException(
          'O gênero dos jogadores devem ser iguais.',
          400,
        );
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
        competition_id: createDuoRequestDto.competition,
        status: {
          notIn: [
            RequestStatus.CANCELED,
            RequestStatus.DISREGARDED,
            RequestStatus.DENIED,
          ],
        },
      },
    });

    if (duoRequestDuplicated) {
      throw new HttpException('Já existe uma solicitação feita.', 400);
    }
  }
}
