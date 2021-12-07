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
- Adicionar a linha: `*/10 * * * * ./caminho absoluto start.sh` para executar a cada 10 minutos ex: `*/10 * * * * ./Users/TEUHOMEFOLDER/marcar-servico/start.sh`
- Verifique se o crontab esta ativo: `crontab -l`
- Observe o log em app.log
