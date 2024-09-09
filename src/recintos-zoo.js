class RecintosZoo {
    constructor() {
        this.recintos = [
            {
                'id': 1, 'bioma': 'savana',
                'tamanho_total': 10, "animais_existentes": { "MACACO": 3 }
            },

            {
                'id': 2, 'bioma': 'floresta',
                'tamanho_total': 5, "animais_existentes": {}
            },

            {
                'id': 3, 'bioma': 'savana e rio',
                'tamanho_total': 7, "animais_existentes": { "GAZELA": 1 }
            },

            {
                'id': 4, 'bioma': 'rio',
                'tamanho_total': 8, "animais_existentes": {}
            },

            {
                'id': 5, 'bioma': 'savana',
                'tamanho_total': 9, "animais_existentes": { "LEAO": 1 }
            }
        ]
        //---------------------------------------//
        this.animais = {
            'LEAO': { 'tamanho': 3, 'biomas': ['savana'], 'carnivoro': true },
            'LEOPARDO': { 'tamanho': 2, 'biomas': ['savana'], 'carnivoro': true },
            'CROCODILO': { 'tamanho': 3, 'biomas': ['rio'], 'carnivoro': true },
            'MACACO': { 'tamanho': 1, 'biomas': ['savana', 'floresta'], 'carnivoro': false },
            'GAZELA': { 'tamanho': 2, 'biomas': ['savana'], 'carnivoro': false },
            'HIPOPOTAMO': { 'tamanho': 4, 'biomas': ['savana', 'rio'], 'carnivoro': false },
        }

    }

    analisaRecintos(animal, quantidade) {
        /*
        1) Um animal se sente confortável se está num bioma adequado e com espaço suficiente para cada indivíduo
        2) Animais carnívoros devem habitar somente com a própria espécie
        3) Animais já presentes no recinto devem continuar confortáveis com a inclusão do(s) novo(s)
        4) Hipopótamo(s) só tolera(m) outras espécies estando num recinto com savana e rio
        5) Um macaco não se sente confortável sem outro animal no recinto, seja da mesma ou outra espécie
        6) Quando há mais de uma espécie no mesmo recinto, é preciso considerar 1 espaço extra ocupado
        7) Não é possível separar os lotes de animais nem trocar os animais que já existem de recinto (eles são muito apegados!).
        Por exemplo, se chegar um lote de 12 macacos, não é possível colocar 6 em 2 recintos.*/
        if (!this.animais.hasOwnProperty(animal)) {
            return "Animal inválido"
        }
        if (quantidade <= 0 || typeof quantidade != 'number') {
            return "Quantidade inválida"
        }

        this.pega_informacoes = this.animais[animal];
        this.tamanho_total = this.pega_informacoes.tamanho * quantidade;
        this.biomas_Adequados = this.pega_informacoes.biomas;
        this.carnivoro = this.pega_informacoes.carnivoro;

        this.recintos_viaveis = [];




        for (this.recinto of this.recintos) {
            // bioma
            if (!this.biomas_Adequados.some(bioma => this.recinto.bioma.includes(bioma))) {
                continue;
            }

            // carnívoros ou não
            this.animais_recinto = this.recinto.animais_existentes;
            if (this.carnivoro && Object.keys(this.animais_recinto).length > 0 && !(Object.keys(this.animais_recinto).length === 1 && this.animais_recinto.hasOwnProperty(animal))) {
                continue;
            }

            this.animais_recinto = this.recinto.animais_existentes;
            const existeCarnivoroNoRecinto = Object.keys(this.animais_recinto).some(
                especie => this.animais[especie].carnivoro
            );

            if (existeCarnivoroNoRecinto && (!this.carnivoro || !this.animais_recinto.hasOwnProperty(animal))) {
                continue;
            }

            // hipopótamo
            if (animal === "HIPOPOTAMO" && this.recinto.bioma !== "savana e rio") {
                continue;
            }

            // espaço disponivel
            this.espaco_ocupado = Object.entries(this.animais_recinto).reduce((total, [especie, quantidadeExistente]) => {
                return total + (this.animais[especie].tamanho * quantidadeExistente);
            }, 0);

            // espaço extra
            this.espaco_extra = Object.keys(this.animais_recinto).length > 0 && (!this.animais_recinto.hasOwnProperty(animal) || Object.keys(this.animais_recinto).length > 1) ? 1 : 0;

            this.espaco_necessario = this.espaco_ocupado + this.tamanho_total + this.espaco_extra;

            // espaço disponivel
            if (this.espaco_necessario > this.recinto.tamanho_total) {
                continue;
            }

            // verificar se há macaco
            if (animal === "MACACO" && Object.keys(this.animais_recinto).length === 0 && quantidade === 1) {
                continue;
            }

            // adicionar recinto viável
            this.espaco_livre = this.recinto.tamanho_total - this.espaco_necessario;
            this.recintos_viaveis.push(`Recinto ${this.recinto.id} (espaço livre: ${this.espaco_livre} total: ${this.recinto.tamanho_total})`);
        }

        // resultado
        if (this.recintos_viaveis.length > 0) {
            return {recintos_viaveis: this.recintos_viaveis.sort()};
        } else {
            return"Não há recinto viável";
        }






    }

}
export { RecintosZoo as RecintosZoo };
var resultado = new RecintosZoo
console.log(resultado.analisaRecintos("LEAO", 1))