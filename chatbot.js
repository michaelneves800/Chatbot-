const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const client = new Client();

// Variável para armazenar o estado dos usuários
let userState = {};

// serviço de leitura do QR Code
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

// após isso ele diz que ta tudo certo
client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

// inicializa tudo
client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms)); // Função para criar delay entre mensagens

// Funil
client.on('message', async msg => {
    const chat = await msg.getChat();
    const contact = await msg.getContact();
    const name = contact.pushname;

    // Exibe o menu inicial apos alguma interação..saudação...
    if (msg.body.match(/(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola|boa|bom|Boa|Bom|voltar|retornar)/i) && msg.from.endsWith('@c.us')) {
        userState[msg.from] = { step: 0 }; // Reinicia o fluxo corretamente
        await sendMainMenu(msg, name);
        return;
    }

    // Verifica se o usuário está no menu principal
    if (userState[msg.from] && userState[msg.from].step === 0) {
        if (msg.body === '1') {
            userState[msg.from].step = 1; // Define o estado para "Aluno"
            await sendAlunoOptions(msg);
            return;
        } else if (msg.body === '2') {
            userState[msg.from].step = 2; // Define o estado para "Assistente - Presencial"
            await sendAssistentePresencialOptions(msg);
            return;
        } else if (msg.body === '3') {
            userState[msg.from].step = 3; // Define o estado para "Assistente - Online"
            await sendAssistenteOnlineOptions(msg);
            return;
        } else if (msg.body === '4') {
            userState[msg.from].step = 4; // Define o estado para "Novo Ingressante"
            await sendNovoIngressanteOptions(msg);
            return;
        } else if (msg.body === '5') {
            userState[msg.from].step = 5; // Define o estado para "Outras Perguntas"
            await sendOutrasPerguntas(msg);
            return;
        } else {
            await client.sendMessage(msg.from, 'Opção inválida. Escolha uma das opções do menu.');
            return;
        }
    }

    // Fluxo para "Aluno"
    if (userState[msg.from] && userState[msg.from].step === 1) {
        await handleAlunoOptions(msg, name);
        return;
    }

    // Fluxo para "Assistente - Presencial"
    if (userState[msg.from] && userState[msg.from].step === 2) {
        await handleAssistentePresencialOptions(msg, name);
        return;
    }

    // Fluxo para "Assistente - Online"
    if (userState[msg.from] && userState[msg.from].step === 3) {
        await handleAssistenteOnlineOptions(msg, name);
        return;
    }

    // Fluxo para "Novo Ingressante"
    if (userState[msg.from] && userState[msg.from].step === 4) {
        await handleNovoIngressanteOptions(msg);
        return;
    }
    
    // Fluxo para "Outras Perguntas"
     if (userState[msg.from] && userState[msg.from].step === 5) {
        await handleOutrasPerguntas(msg);
        return;
    }    
});

// **Função para enviar o menu principal**
async function sendMainMenu(msg, name) {
    const chat = await msg.getChat();
    await chat.sendStateTyping();
    await delay(3000);
    await client.sendMessage(msg.from,
        `🌟 *Olá, ${name.split(" ")[0]}!* Seja bem-vindo(a) a *TIA* Assistente virtual do *TalentoTech*! 🤖✨\n
📌 *Como posso te ajudar hoje?*\n\n
🔹 *Escolha uma das opções abaixo e digite o número correspondente:* \n\n
🎓 1️⃣ - *Sou Aluno*\n
🏢 2️⃣ - *Sou Assistente - Presencial*\n
💻 3️⃣ - *Sou Assistente - Online*\n
🆕 4️⃣ - *Novo Ingressante*\n
❓ 5️⃣ - *Outras perguntas*\n\n
✍️ *Digite o número correspondente à sua opção!*`
    );
}

// **Função para enviar as opções do Aluno**
async function sendAlunoOptions(msg) {
    await delay(3000);
    await client.sendMessage(msg.from,
        `🎓 *Menu - Aluno*\n
    📌 Como posso te ajudar hoje?\n\n
    1️⃣ - *Problemas no AVA*\n
    2️⃣ - *Declaração de Matrícula*\n
    3️⃣ - *Envio de Documentos* \n
    4️⃣ - *Declaração de Imposto de Renda*\n
    5️⃣ - *Desistência*\n
    6️⃣ - *Outros*\n\n
    ✍️ *Digite o número correspondente à sua opção!*`
    );
    
}

// **Função para enviar as opções do Assistente Presencial**
async function sendAssistentePresencialOptions(msg) {
    await delay(3000);
    await client.sendMessage(msg.from,
        `🏢 *Menu - Assistente Presencial*\n
    📌 Qual a sua dúvida?\n\n
    1️⃣ - *Problemas com AVA* \n
    2️⃣ - *Documentos* \n
    3️⃣ - *Desistência de aluno* \n
    4️⃣ - *Desistência do assistente* \n
    5️⃣ - *Declaração de Trabalho* \n
    6️⃣ - *Declaração de Matrícula do Aluno* \n
    7️⃣ - *Declaração de Imposto de Renda* \n
    8️⃣ - *Prova de Segunda Chamada* \n
    9️⃣ - *Problemas com Provas/Seminário* \n
    🔟 - *Outros* ❓\n\n
    ✍️ *Digite o número correspondente à sua opção!*`
    );
    
}

//**Função para enviar as opções do Assistente Online */
async function sendAssistenteOnlineOptions(msg) {
    await delay(3000);
    await client.sendMessage(msg.from,
        `💻 *Menu - Assistente Online*\n
    📌 Como posso te ajudar?\n\n
    1️⃣ - *Problemas com o AVA* \n
    2️⃣ - *Declaração de Trabalho* \n
    3️⃣ - *Declaração de Imposto de Renda* \n
    4️⃣ - *Desistência do assistente* \n
    5️⃣ - *Diárias* \n
    6️⃣ - *Outros* ❓\n\n
    ✍️ *Digite o número correspondente à sua opção!*`
    );
    
}

// **Função para enviar as opções do Novo Ingressante**
async function sendNovoIngressanteOptions(msg) {
    await delay(3000);
    await client.sendMessage(msg.from,
        `🆕 *Menu - Novo Ingressante*\n
    📌 Como posso te ajudar?\n\n
    1️⃣ - *Como realizar minha inscrição no Projeto?* \n
    2️⃣ - *Como faço minha matrícula no AVA?* \n
    3️⃣ - *Outros* ❓\n\n
    ✍️ *Digite o número correspondente à sua opção!*`
    );
    
}

// **Função para enviar as opções de Outras Perguntas**
async function sendOutrasPerguntas(msg) {
    await delay(3000);
    await client.sendMessage(msg.from,
        `❓ *Outras Perguntas*\n
    📌 Por favor, digite sua dúvida abaixo para que possamos ajudá-lo(a). \n\n
    💡 *Nossa equipe analisará sua questão e retornará o mais breve possível!* ⏳\n\n
    🎉 *A equipe do TalentoTech agradece. Tenha um ótimo dia!* 🌟`
    );

    // Encerra o fluxo do usuário
    userState[msg.from] = {};
}



// **Funções de Resposta para cada Usuario**

// **Função para tratar as respostas do Aluno**
async function handleAlunoOptions(msg) {
    const responses = {
        '1': 'Entre em contato com o seu assistente presencial para problemas no AVA.',
        '2': 'Seu documento será processado e enviado dentro de 24 horas, aguarde o retorno.',
        '3': 'Entre em contato com o seu assistente presencial para envio de documentos.',
        '4': 'Seu documento será processado e enviado dentro de 24 horas, aguarde o retorno.',
        '5': 'Entre em contato com o seu assistente presencial para desistência.',
        '6': 'Descreva sua dúvida e aguarde retorno.'
    };

    if (responses[msg.body]) {
        await client.sendMessage(msg.from, responses[msg.body]);

        // Mensagem final antes de encerrar o chat
        await delay(2000);
        await client.sendMessage(msg.from, '🎉 *O TalentoTech agradece e segue trabalhando para melhor atendê-lo. Ótimo dia!* ☀️');

        // Encerra o fluxo do usuário
        userState[msg.from] = {};
        return;
    } else {
        await client.sendMessage(msg.from, 'Opção inválida. Escolha uma das opções listadas.');
    }

}

// **Função para tratar a opção "5 - Outras Perguntas"**
async function handleOutrasPerguntas(msg) {
    await client.sendMessage(msg.from,
        `❓ *Outras Perguntas*\n\n
        📌 Você selecionou "Outras Perguntas".\n
        ✍️ *Por favor, digite sua dúvida em uma única mensagem para que possamos ajudá-lo da melhor forma possível.*`
    );

    // Define que o próximo envio de mensagem do usuário será tratado como a dúvida
    userState[msg.from] = { step: 6 }; 
}

// **Função para processar a dúvida digitada pelo usuário**
async function handleUserQuestion(msg) {
    if (userState[msg.from] && userState[msg.from].step === 6) {
        await delay(2000);
        await client.sendMessage(msg.from, 
            `🎉 *O TalentoTech agradece e retorna o mais breve possível.*\n
            Seguimos trabalhando para melhor atendê-lo. *Ótimo dia!* ☀️`
        );

        // Reseta o estado do usuário, encerrando o fluxo corretamente
        userState[msg.from] = {};
    }
}


// **Função para tratar as respostas do Assistente Online**
async function handleAssistenteOnlineOptions(msg) {
    const responses = {
        '1': 'Se estiver enfrentando problemas com o AVA, tente limpar o cache do navegador e acessar novamente. Se o problema persistir, entre em contato com o suporte técnico Michael ',
        '2': 'Informe abaixo seu nome completo, CPF e data de entrada no Projeto e aguarde nosso retorno',
        '3': 'Não realizamos informe de rendimentos, mas você pode utilizar uma declaração de trabalho para utilizar no Imposto de Renda. Para recebê-la, informe abaixo seu nome completo, CPF e data de entrada no Projeto.Aguarde nosso retorno',
        '4': 'Informe seu nome completo, CPF e data de início no Projeto. Após isso, aguarde para receber o formulário de desistência. Ele deve ser assinado e enviado novamente em PDF!',
        '5': 'Caso seja sua primeira diária, informe o dia e horário que irá sair de sua cidade, e o dia e horário em que irá chegar na sua cidade. As diárias são programadas para caírem até 1 dia antes do encontro!',
        '6': 'Informe abaixo sua dúvida e aguarde retorno.'
    };

    if (responses[msg.body]) {
        await client.sendMessage(msg.from, responses[msg.body]);

        // Mensagem final antes de encerrar o chat
        await delay(2000);
        await client.sendMessage(msg.from, '🎉 *O TalentoTech agradece e segue trabalhando para melhor atendê-lo. Ótimo dia!* ☀️');

        // Encerra o fluxo do usuário
        userState[msg.from] = {};
        return;
    } else {
        await client.sendMessage(msg.from, 'Opção inválida. Escolha uma das opções listadas.');
    }

}

// **Função para tratar as respostas do Assistente Presencial**
async function handleAssistentePresencialOptions(msg) {
    const responses = {
        '1': 'Entre em contato com o Michael no WhatsApp',
        '2': 'Envie em PDF a documentação solicitada, o nome do arquivo deverá estar no nome do aluno.',
        '3': 'Antes de efetivar a desistência, tente ter uma conversa acolhedora e assertiva com o aluno para convencê-lo a permanecer no curso. Caso o processo já tenha sido feito, informe o(a) secretário(a) regional sobre a desistência.',
        '4': 'Informe seu nome completo, CPF, e data de início no Projeto. Após isso, aguarde para receber o formulário de desistência, ele deve ser assinado e enviado novamente em PDF!',
        '5': 'Informe abaixo seu nome completo, CPF e data de entrada no Projeto.',
        '6': 'Informe abaixo o nome completo do aluno; CPF e se a bolsa dele é de R$1375,00 ou R$1500,00.',
        '7': 'Não realizamos informe de rendimentos, mas você pode utilizar uma declaração de trabalho para utilizar no Imposto de Renda. Para recebê-la, informe abaixo seu nome completo, CPF e data de entrada no Projeto.',
        '8': 'O aluno deverá enviar no AVA (Secretaria Virtual - https://avaextensao.apps.uepg.br/course/view.php?id=116) a justificativa da ausência no dia do encontro. Você deverá avaliar no AVA se a justificativa pode ser aceita. Após isso, entre em contato com a Professora Victória através do número (42) 99971-xXxX para informar a quantidade de alunos que precisam da segunda chamada. Agende com o aluno a data e horário para realizar da prova e entre em contato com o Michael no WhatsApp: (42) 99962-XxXx para receber a senha da prova.',
        '9': 'Se você está no encontro presencial e surgiu algum problema na prova, lembre-se que mais de 1000 pessoas estão acessando o AVA ao mesmo tempo, ele pode sofrer com instabilidade e lentidão. Peça para que os alunos atualizem a página ou tentem limpar o cache do navegador.',
        '10': 'Informe abaixo sua dúvida e aguarde retorno'
    };

    if (responses[msg.body]) {
        await client.sendMessage(msg.from, responses[msg.body]);

        // Mensagem final antes de encerrar o chat
        await delay(2000);
        await client.sendMessage(msg.from, '🎉 *O TalentoTech agradece e segue trabalhando para melhor atendê-lo. Ótimo dia!* ☀️');

        // Encerra o fluxo do usuário
        userState[msg.from] = {};
        return;
    } else {
        await client.sendMessage(msg.from, 'Opção inválida. Escolha uma das opções listadas.');
    }
}

// **Função para tratar as respostas do Novo Ingressante**
async function handleNovoIngressanteOptions(msg) {
    const responses = {
        '1': 'Para realizar sua inscrição no Projeto, acesse nosso site oficial e siga o passo a passo para inscrição. Caso tenha dúvidas, entre em contato com Assistente',
        '2': 'Para realizar sua matrícula no AVA, acesse a plataforma através do link enviado no e-mail de boas-vindas e siga as instruções. Se precisar de ajuda, entre em contato com seu assistente.',
        '3': 'Informe abaixo sua dúvida específica para que possamos ajudá-lo e aguarde o retorno'
    };

    if (responses[msg.body]) {
        await client.sendMessage(msg.from, responses[msg.body]);

        // Mensagem final antes de encerrar o chat
        await delay(2000);
        await client.sendMessage(msg.from, '🎉 *O TalentoTech agradece e segue trabalhando para melhor atendê-lo. Ótimo dia!* ☀️');

        // Encerra o fluxo do usuário
        userState[msg.from] = {};
        return;
    } else {
        await client.sendMessage(msg.from, 'Opção inválida. Escolha uma das opções listadas.');
    }
}

// **Função para tratar as respostas de Outras Perguntas**
async function handleOutrasPerguntas(msg) {
    await client.sendMessage(msg.from,
        `Obrigado por entrar em contato!\n
        Nossa equipe analisará sua dúvida e retornará o mais breve possível.\n
        A equipe TalentoTech agradece e segue trabalhando para melhor atendê-los!`);
    
    userState[msg.from] = {}; // Encerra o fluxo
}