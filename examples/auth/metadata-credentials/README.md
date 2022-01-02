# Авторизация в Yandex database c помощью сервиса метаданных.

# Документация
[Авторизация в YDB CLI](https://cloud.yandex.ru/docs/ydb/ydb-cli/authorization)

## Где работает сервис метаданных
Сервис метаданных работает на виртуальных машинах внутри Yandex compute cloud, а также в serverless функциях Yandex

## Данный пример представляет собой отдельный проект по развертыванию NodeJS serverless функции

Для запуска Вам необходимо:

1. скопировать все файлы проекта из диретории metadata-credentials
2. установить зависимости командой npm i
3. убедитесь что у Вас в базе данных есть таблица series (она создается в предыдущих примерах)
4. внесите Ваши данные в main.env
5. следуйте инструкциям в deploy/deploy.md для deploy функции
6. вызовите функцию и Вы увидите json с описанием полей таблицы series


Пример на python
https://cloud.yandex.ru/docs/functions/solutions/connect-to-ydb#create-function
