<?php

namespace App\State;

use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use App\Entity\Product;
use ApiPlatform\State\ProcessorInterface;
use ApiPlatform\Metadata\Operation;

class BusinessLogic implements ProcessorInterface
{
    private LoggerInterface $logger;
    private EntityManagerInterface $entityManager;

    public function __construct(LoggerInterface $logger, EntityManagerInterface $entityManager)
    {
        $this->logger = $logger;
        $this->entityManager = $entityManager;
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if (!$data instanceof Product) {
            return $data;
        }

        // Пример логирования
        $this->logger->info('Начало обработки продукта', ['product' => $data->getName()]);

        // Применение скидки
        if ($data->getPrice() > 100) {
            $discount = 10; // Скидка 10%
            $discountedPrice = $data->getPrice() * ((100 - $discount) / 100);
            $data->setPrice($discountedPrice);

            // Логирование информации о примененной скидке
            $this->logger->info('Скидка применена', [
                'product' => $data->getName(),
                'original_price' => $data->getPrice(),
                'discounted_price' => $discountedPrice,
            ]);
        } else {
            $this->logger->info('Скидка не применена, так как цена ниже порога', [
                'product' => $data->getName(),
                'price' => $data->getPrice(),
            ]);
        }

        // Сохранение изменений в базе данных
        $this->entityManager->persist($data);
        $this->entityManager->flush();

        return $data;
    }
}
