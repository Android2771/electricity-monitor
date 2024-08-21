# Setting up monitor
* Create an `.env` file with the unique uuid4 you generated, example:
```
KEY=2eb4215a-1b5b-44da-93d4-58a4a5da5024
```
* Set `firebaseConfig.js` with the object that Firebase gives you in the `Project settings` with `npm` selected under `SDK setup and configuration`
* Run `docker compose up -d --build` (if you need docker, go [here](https://github.com/docker/docker-install))