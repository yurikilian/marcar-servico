# MARCAR SERVICO NO CONSULADO BR

## Passos iniciais

Criat bot no telegram

Adicionar bot ao grupo e obter group id usando o method getUpdates

Adicionar usuarios interessados

Usar ficheiro dotenv .env.example e criar um .env

Instalar packages: `npm install`
Executar: `npm run start`

## Configurar Crontab para rodar automaticamente (Opcional)

- `crontab -e` - vai abrir o editor vim
- Adicionar a linha: ` * 10 * * * ./start.sh` para executar a cada 10 minutos
- Verifique se o crontab esta ativo: `crontab -l`
- Observe o log em app.log
