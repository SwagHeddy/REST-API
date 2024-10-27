// src/EventSubscriber/RoleBasedNormalizationSubscriber.php

namespace App\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class RoleBasedNormalizationSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['onKernelView', EventPriorities::PRE_SERIALIZE],
        ];
    }

    public function onKernelView(ViewEvent $event): void
    {
        $request = $event->getRequest();

        // Проверяем наличие параметра 'role'
        $role = $request->query->get('role');

        // Сбрасываем контекст нормализации
        $context = [];

        if ($role === 'admin') {
            // Устанавливаем группы нормализации для администратора
            $context['groups'] = ['product:read:admin'];
        } else {
            // Устанавливаем группы нормализации для покупателя
            $context['groups'] = ['product:read:customer'];
        }

        // Устанавливаем обновленный контекст нормализации
        $request->attributes->set('_api_normalization_context', $context);
    }
}
