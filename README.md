# API Documentation

## Overview

This API позволяет управлять категориями и товарами для интернет-магазина бытовой и компьютерной техники. API построен с использованием PHP, Symfony и ApiPlatform, контейнеризирован с помощью Docker и использует PostgreSQL в качестве базы данных. Ниже представлены инструкции по установке, настройке и запуску API для систем Windows и Linux.

## Инструкции по установке

### Предварительные требования

- [Docker](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/downloads/win/)
- [Composer](https://getcomposer.org/Composer-Setup.exe)
- [PHP 8.2+](https://windows.php.net/download#php-8.3)
- [Symfony CLI](https://symfony.com/download) (опиционально)

### Клонирование репозитория

Сначала клонируйте репозиторий с GitHub:

```bash
# Клонируйте репозиторий
git clone <repository-url>

# Перейдите в директорию проекта
cd <project-directory>
```

### Установка зависимостей

Для установки зависимостей нужен Composer. Выполните следующую команду для установки всех необходимых пакетов:

```bash
composer install
```

## Инструкция по установке на Windows

### Настройка Docker

1. Убедитесь, что Docker Desktop установлен на вашем компьютере с Windows.
2. Откройте Docker Desktop и убедитесь, что включен бэкэнд WSL 2 для поддержки Linux-контейнеров.

### Настройка переменных окружения

1. Создайте файл `.env.local` на основе `.env.example`.
2. Настройте параметры базы данных в соответствии с вашей конфигурацией Docker:
   ```dotenv
   DATABASE_URL="postgresql://user:password@database_host:5432/database_name"
   ```

### Запуск Docker Compose

1. Откройте терминал и выполните следующую команду для сборки и запуска контейнеров:

   ```bash
   docker-compose up --build -d
   ```

### Запуск миграций

Для настройки структуры базы данных выполните следующую команду:

```bash
docker-compose exec php php bin/console doctrine:migrations:migrate
```

## Инструкция по установке на Linux

### Настройка Docker

1. Установите Docker и Docker Compose на вашу Linux-систему:
   ```bash
   sudo apt-get update
   sudo apt-get install docker.io docker-compose -y
   ```

2. Добавьте своего пользователя в группу Docker, чтобы избежать необходимости использования `sudo`:
   ```bash
   sudo usermod -aG docker $USER
   ```
   Выйдите из системы и войдите снова, чтобы применить это изменение.

### Настройка переменных окружения

1. Создайте файл `.env.local` на основе `.env.example`.
2. Установите переменные окружения для PostgreSQL в файле `.env.local`:
   ```dotenv
   DATABASE_URL="postgresql://user:password@database_host:5432/database_name"
   ```

### Запуск Docker Compose

1. В терминале выполните следующую команду для запуска всех Docker-контейнеров:
   ```bash
   docker-compose up --build -d
   ```

### Запуск миграций

Настройте структуру базы данных с помощью:

```bash
docker-compose exec php php bin/console doctrine:migrations:migrate
```

## Запуск API

После запуска контейнеров вы можете получить доступ к API по следующему URL:

- **Базовый URL**: `http://localhost:8000`

### Примеры конечных точек

- **GET /api/categories** - Получение всех категорий.
- **POST /api/categories** - Создание новой категории.
- **GET /api/products** - Получение всех товаров.
- **POST /api/products** - Создание нового товара.
- **PUT /api/products/{id}** - Обновление товара по ID.
- **DELETE /api/products/{id}** - Удаление товара по ID.

### Группы нормализации

Группы нормализации используются для управления полями, которые отображаются при сериализации. Убедитесь, что вы устанавливаете соответствующие группы нормализации и денормализации при взаимодействии с разными конечными точками.

## Тестирование API

Вы можете использовать такие инструменты, как [Postman](https://www.postman.com/) или [cURL](https://curl.se/), для тестирования API.

### Пример использования cURL

```bash
curl -X GET http://localhost:8000/api/products
```

## Остановка контейнеров

Для остановки всех Docker-контейнеров выполните:

```bash
docker-compose down
```

## Дополнительные замечания

- Убедитесь, что Docker Desktop запущен на Windows и что WSL правильно настроен.
- Symfony CLI также может использоваться для отладки и выполнения команд во время локальной разработки.
