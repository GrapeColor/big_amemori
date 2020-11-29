# BIG AMEMORI
にじさんじライバー「雨森小夜」の非公式ファンサーバー向けの、プライベートBOTです。  
チャンネルメッセージの一斉コピー・削除や、ライバーにまつわる投稿を監視し、指定チャンネルへ転送します。  
  
その他、各イベントに併せて一時的な機能を提供します。  

## 運用方法
DiscordとTwitterのAPIを使用しているため、以下の5つの環境変数を設定する必要があります。  

- DISCORD_TOKEN
- TWITTER_CONSUMER_KEY
- TWITTER_CONSUMER_SECRET
- TWITTER_ACCESS_TOKEN
- TWITTER_ACCESS_TOKEN_SECRET

Docker Composeを使用してるため、そのまま`docker-compose up`でBOTが起動します。  
