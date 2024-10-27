# 1. Используем официальный PHP образ
FROM php:8.2-cli

# 2. Устанавливаем необходимые зависимости и PHP расширения
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libicu-dev \
    libpq-dev \
    && docker-php-ext-install intl pdo pdo_pgsql

# 3. Устанавливаем Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 4. Копируем файлы проекта в контейнер
WORKDIR /app
COPY . /app

# 5. Устанавливаем зависимости Symfony
RUN composer install --no-scripts --no-interaction --optimize-autoloader

# 6. Настраиваем права доступа
RUN chown -R www-data:www-data /app

# 7. Устанавливаем переменные окружения для Symfony
ENV APP_ENV=prod
ENV APP_DEBUG=0

# 8. Открываем порт для встроенного PHP сервера
EXPOSE 8000

# 9. Команда для запуска PHP встроенного сервера
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]
