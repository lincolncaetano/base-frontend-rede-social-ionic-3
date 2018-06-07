import { RefDTO } from "./ref.dto";

export interface UsuarioBloqueadoDTO {
    usuarioId: string;
    usuarioBloqueadoId: string;
    nomeUsuarioBloq?: string;
    usernameBloq?: string;
    imageUrl? : string;
}