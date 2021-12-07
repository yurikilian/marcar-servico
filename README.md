# BOT MARCAÇÃO SERVICO CONSULADO

A ideia deste script é acessar automaticamente a página do consulado e consultar por horários disponíveis para algum serviço que foi marcado. Infelizmente o sistema atual nāo tem inteligência suficiente para mostrar as novas marcações. Por isto esta gambiarra.

O script avisa ao bot do telegram quando tem agenda disponivel. Ele esta configurado por padrao para executar a cada 30 minutos.

Use-o com cautela. Nao fique inundando a pagina que ja é ruim sem realmente precisar.

## Passos iniciais

Criar bot no telegram e associar ele a um grupo do telegram. Pegar o token do bot e tambem o group id ao qual deseja enviar as informacoes. Para mais detalhes procure um tutorial na web. Exemplo: https://sendpulse.com/knowledge-base/chatbot/create-telegram-chatbot

Certifique-se que o google chrome esteja instalado na sua máquina

Usar ficheiro dotenv .env.example e copiar e renomear para um .env. Veja os detalhes abaixo.

```SH
CRONTAB=*/10 * * * * # Tempo de execucao: a acada 10 minutos
GOV_USER="email@domain.com" # Email de login
GOV_PASSWORD="passowrd" # Senha do site
GOV_PROCESS_ID="grovprocessid" # Id do processo aguardando por marcacao

TELEGRAM_BOT_TOKEN="chatbottoken" #O token do telegram chatbot
TELEGRAM_CHAT_ID="chatid" #O id do grupo associado ao chatbot

CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" #Local do google chrome instalado

```

## Execuçāo

Este script utiliza a biblioteca pm2 para deixar o servico em background. O projeto tem 3 scripts uteis para serem utilizado:

- Iniciar o projeto em background: `npm run start`
- Matar o processo em background: `npm run kill`
- Listar os processos em execuçāo: `npm run list`
