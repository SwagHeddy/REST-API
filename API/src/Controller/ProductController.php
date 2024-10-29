<?php

namespace App\Controller;

use App\Repository\ProductRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Security\Core\Security;

class ProductController
{
    private ProductRepository $productRepository;
    private SerializerInterface $serializer;

    public function __construct(ProductRepository $productRepository, SerializerInterface $serializer)
    {
        $this->productRepository = $productRepository;
        $this->serializer = $serializer;
    }

    #[Route('/api/products/category/{id}', name: 'products_by_category', methods: ['GET'])]
    public function getProductsByCategory(int $id): JsonResponse
    {
        $products = $this->productRepository->findByCategory($id);

        // Вот тут поменять под группу пользователя если нужно
        $data = $this->serializer->serialize($products, 'json', ['groups' => ['product:read:admin']]);
        
        return new JsonResponse($data, 200, [], true);
    }
}