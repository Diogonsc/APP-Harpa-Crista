import { Platform } from "react-native";

let FileSystem: any;
if (Platform.OS !== "web") {
  FileSystem = require("expo-file-system");
}

class DownloadService {
  downloadDirectory =
    Platform.OS !== "web" ? `${FileSystem.documentDirectory}harpa-crista/` : null;

  constructor() {
    if (Platform.OS !== "web") {
      this.ensureDirectoryExists();
    }
  }

  async ensureDirectoryExists(): Promise<void> {
    if (Platform.OS === "web") return;

    const dirInfo = await FileSystem.getInfoAsync(this.downloadDirectory);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(this.downloadDirectory, {
        intermediates: true,
      });
    }
  }

  async downloadAudio(url: string, filename: string): Promise<string | null> {
    try {
      const fileUri = `${this.downloadDirectory}${filename}`;
      const { uri } = await FileSystem.downloadAsync(url, fileUri);
      console.log(`Áudio ${filename} baixado com sucesso`);
      return uri;
    } catch (error) {
      console.error("Erro ao baixar áudio:", error);
      return null;
    }
  }

  async getDownloadedFiles(): Promise<any[]> {
    try {
      const files = await FileSystem.readDirectoryAsync(this.downloadDirectory);
      return Promise.all(
        files.map(async (file: string) =>
          FileSystem.getInfoAsync(`${this.downloadDirectory}${file}`)
        )
      );
    } catch (error) {
      console.error("Erro ao listar arquivos:", error);
      return [];
    }
  }

  async isAudioDownloaded(filename: string): Promise<boolean> {
    if (Platform.OS === "web") return false;
    
    try {
      const fileUri = `${this.downloadDirectory}${filename}`;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      return fileInfo.exists;
    } catch (error) {
      console.error("Erro ao verificar arquivo:", error);
      return false;
    }
  }

  async deleteAudio(filename: string): Promise<boolean> {
    if (Platform.OS === "web") return false;
    
    try {
      const fileUri = `${this.downloadDirectory}${filename}`;
      await FileSystem.deleteAsync(fileUri);
      console.log(`Áudio ${filename} removido`);
      return true;
    } catch (error) {
      console.error("Erro ao remover arquivo:", error);
      return false;
    }
  }
}

export default new DownloadService(); 