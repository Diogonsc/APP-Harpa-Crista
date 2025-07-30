export interface HinoLocal {
  numero: number;
  titulo: string;
  autor?: string;
  audio?: string;
  audioUrl?: string;
}

export interface HinoCompleto extends HinoLocal {
  letra: string;
  verses?: Verso[];
  coro?: string;
}

export interface Verso {
  sequence?: number;
  lyrics: string;
  chorus: boolean;
}

export interface Audio {
  numero: number;
  titulo: string;
  autor?: string;
  audioUrl: string;
  filename: string;
}

export interface Estatisticas {
  totalHinos: number;
  totalAudios: number;
  hinosComAudio: number;
  hinosSemAudio: number;
  porcentagemComAudio: number;
}

export interface Paginacao {
  pagina: number;
  porPagina: number;
  total: number;
  totalPaginas: number;
}

export interface HinosPaginados {
  hinos: HinoLocal[];
  paginacao: Paginacao;
}

export interface AudiosPaginados {
  audios: Audio[];
  paginacao: Paginacao;
}

export interface ApiResponse {
  hinos: any[];
  currentPage?: number;
  totalPages?: number;
  totalHinos?: number;
}

export interface BuscaResponse {
  hinos: any[];
  currentPage?: number;
  totalPages?: number;
  totalHinos?: number;
} 