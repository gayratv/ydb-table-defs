# Авторизация с помощью IAM-токена
[Авторизация в YDB CLI](https://cloud.yandex.ru/docs/ydb/ydb-cli/authorization)

[IAM-токен](https://cloud.yandex.ru/docs/iam/concepts/authorization/iam-token)

IAM-токен — уникальная последовательность символов, которая выдается пользователю после прохождения аутентификации. С помощью этого токена пользователь авторизуется в API Yandex.Cloud и выполняет операции с ресурсами.

### Получите IAM-токен:
```bash
yc iam create-token
```
Сохраните полученный токен в файл iam-token.txt в директории examples/auth/access-token-credentials/iam-token.txt

**Время жизни IAM-токена не более 12 часов.**

Проверьте корректность авторизации, запросив информацию о пользователе:

```bash
ydb \
--endpoint ydb.serverless.yandexcloud.net:2135 \
--database /ru-central1/b1gib03pgvqrrfvhl3kb/etnn9li53arnjigll14s \
--iam-token-file iam-token.txt \
discovery whoami \
--groups
```

Запустите пример.
Пример инициализирует драйвер с помощью IAM token
