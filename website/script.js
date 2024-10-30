document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('categorySelect');
    const productList = document.getElementById('productList');
    const backButton = document.getElementById('backButton');
    const nextButton = document.getElementById('nextButton');
    const GotoMainButton = document.getElementById('GotoMainButton');
    const adminPanelButton = document.getElementById('adminPanelButton');
    const addProductButton = document.getElementById('addProductButton');
    const submitProductButton = document.getElementById('submitProductButton');
    const cancelProductButton = document.getElementById('cancelProductButton');
    const addCategoryButton = document.getElementById('addCategoryButton');
    const submitCategoryButton = document.getElementById('submitCategoryButton');
    const cancelCategoryButton = document.getElementById('cancelCategoryButton');
    const formContainer = document.getElementById('formContainer');
    const overlay = document.getElementById('overlay');
    const loadingProducts = document.getElementById('loadingProducts');
    const loadingCategories = document.getElementById('loadingCategories');
    const deleteProductButton = document.getElementById('deleteProductButton');
    const categoryToDeleteSelect = document.getElementById('categoryToDeleteSelect');
    const deleteCategoryContainer = document.getElementById('deleteCategoryContainer');
    let currentPage = 1;
    let selectedCategory = '';

    // Определение, на какой странице мы находимся
    const isAdminPage = window.location.pathname.includes('admin.html');

    // Функция для загрузки категорий
    async function loadCategories() {
        if (!loadingCategories) return;
        loadingCategories.style.display = 'block';
        loadingProducts.style.display = 'none';

        try {
            const response = await fetch('http://127.0.0.1:8000/api/categories');
            const data = await response.json();
            const categories = data['member'];

            categorySelect.innerHTML = '';
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Выберите категорию';
            categorySelect.appendChild(defaultOption);

            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Ошибка загрузки категорий:', error);
        } finally {
            loadingCategories.style.display = 'none';
        }
    }

    async function loadProductsWithoutCheckboxes(page) {
        if (!loadingProducts || !productList) return;
        loadingProducts.style.display = 'block';
        productList.innerHTML = '';

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/products?page=${page}&category=${selectedCategory}`);
            const data = await response.json();
            const products = data['member'];

            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product'); // Используем класс product для стилей
                productDiv.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>Цена: ${product.price}₽</p>
                    <p>${product.description}</p>
                `;
                productList.appendChild(productDiv);
            });

            updatePagination(data);
        } catch (error) {
            console.error('Ошибка загрузки продуктов:', error);
        } finally {
            loadingProducts.style.display = 'none';
        }
    }

    // Функция для загрузки продуктов с чекбоксами (для админской панели)
    async function loadProductsWithCheckboxes(page) {
        if (!loadingProducts || !productList) return;
        loadingProducts.style.display = 'block';
        productList.innerHTML = '';

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/products?page=${page}&category=${selectedCategory}`);
            const data = await response.json();
            const products = data['member'];

            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product-item');
                productDiv.innerHTML = `
                    <span>${product.name}</span>
                    <p>Цена: ${product.price}₽</p>
                    <p>${product.description}</p>
                    <button class="edit-product-button" data-id="${product.id}">Редактировать</button>
                `;
                productList.appendChild(productDiv);
            });

            updatePagination(data);
            addEditProductListeners(); // Добавляем обработчики событий на кнопки редактирования
        } catch (error) {
            console.error('Ошибка загрузки продуктов:', error);
        } finally {
            loadingProducts.style.display = 'none';
        }
    }

    // Функция для обновления пагинации
    function updatePagination(data) {
        if (!backButton || !nextButton) return;
        backButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage >= Math.ceil(data['totalItems'] / 3);
    }

    // Обработчик изменения категории
    if (categorySelect) {
        categorySelect.addEventListener('change', (event) => {
            selectedCategory = event.target.value;
            currentPage = 1;
            if (isAdminPage) {
                loadProductsWithCheckboxes(currentPage);
            } else {
                loadProductsWithoutCheckboxes(currentPage);
            }
        });
    }

    // Обработчик кнопки "Назад"
    if (backButton) {
        backButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                if (isAdminPage) {
                    loadProductsWithCheckboxes(currentPage);
                } else {
                    loadProductsWithoutCheckboxes(currentPage);
                }
            }
        });
    }

    // Обработчик кнопки "Вперед"
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentPage++;
            if (isAdminPage) {
                loadProductsWithCheckboxes(currentPage);
            } else {
                loadProductsWithoutCheckboxes(currentPage);
            }
        });
    }

    // Обработчик кнопки перехода в админскую панель
    if (adminPanelButton) {
        adminPanelButton.addEventListener('click', () => {
            window.location.href = 'admin.html';
        });
    }

    // Обработчик кнопки "Назад к товарам"
    if (GotoMainButton) {
        GotoMainButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Обработчик кнопки добавления товара
    if (addProductButton) {
        addProductButton.addEventListener('click', () => {
            formContainer.style.display = 'block';
            resetProductForm(); // Сбрасываем форму при открытии
        });
    }

    // Обработчик кнопки добавления категории
    if (addCategoryButton) {
        addCategoryButton.addEventListener('click', () => {
            document.getElementById('addCategoryForm').style.display = 'block'; // Показываем форму
            resetCategoryForm(); // Сбрасываем форму при открытии
        });
    }

    // Обработчик кнопки "Отмена" для формы добавления товара
    if (cancelProductButton) {
        cancelProductButton.addEventListener('click', () => {
            formContainer.style.display = 'none';
        });
    }

    // Обработчик кнопки "Отмена" для формы добавления категории
    if (cancelCategoryButton) {
        cancelCategoryButton.addEventListener('click', () => {
            document.getElementById('addCategoryForm').style.display = 'none'; // Скрываем форму
        });
    }

    // Обработчик кнопки "Добавить" для формы добавления товара
    if (submitProductButton) {
        submitProductButton.addEventListener('click', async () => {
            const productName = document.getElementById('productName').value;
            const productPrice = document.getElementById('productPrice').value;
            const productDescription = document.getElementById('productDescription').value;
            const categoryId = categorySelect.value;

            overlay.style.display = 'flex';

            try {
                const response = await fetch('http://127.0.0.1:8000/api/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/ld+json',
                    },
                    body: JSON.stringify({
                        name: productName,
                        description: productDescription,
                        price: parseFloat(productPrice),
                        category: `/api/categories/${categoryId}`
                    }),
                });

                if (response.ok) {
                    alert('Товар успешно добавлен!');
                    formContainer.style.display = 'none';
                    resetProductForm(); // Сбрасываем форму после добавления
                } else {
                    const errorData = await response.json();
                    alert(`Ошибка при добавлении товара: ${errorData.message || response.statusText}`);
                }
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Произошла ошибка при добавлении товара');
            } finally {
                overlay.style.display = 'none';
            }
        });
    }

    // Обработчик кнопки "Добавить" для формы добавления категории
    if (submitCategoryButton) {
        submitCategoryButton.addEventListener('click', async () => {
            const categoryName = document.getElementById('categoryName').value; // Получаем значение

            overlay.style.display = 'flex'; // Показываем индикатор загрузки

            try {
                const response = await fetch('http://127.0.0.1:8000/api/categories', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/ld+json',
                    },
                    body: JSON.stringify({
                        name: categoryName // Отправляем имя категории
                    }),
                });

                if (response.ok) {
                    alert('Категория успешно добавлена!');
                    document.getElementById('addCategoryForm').style.display = 'none'; // Скрываем форму
                    resetCategoryForm(); // Сбрасываем форму после добавления
                    loadCategories(); // Обновляем список категорий
                } else {
                    const errorData = await response.json();
                    alert(`Ошибка при добавлении категории: ${errorData.message || response.statusText}`);
                }
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Произошла ошибка при добавлении категории');
            } finally {
                overlay.style.display = 'none'; // Скрываем индикатор загрузки
            }
        });
    }

    // Обработчик кнопки "Удалить товар"
    if (deleteProductButton) {
        deleteProductButton.addEventListener('click', async () => {
            overlay.style.display = 'flex';
            const products = await fetchProducts();
            displayProductList(products);
        });
    }

    // Функция для загрузки всех продуктов
    async function fetchProducts() {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/products`);
            const data = await response.json();
            return data.member;
        } catch (error) {
            console.error('Ошибка загрузки продуктов:', error);
            return [];
        }
    }

    // Функция для отображения списка продуктов с чекбоксами
    function displayProductList(products) {
        const productListContainer = document.getElementById('productListContainer');
        const productList = document.getElementById('productList');

        productList.innerHTML = '';

        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product-item');
            productDiv.innerHTML = `
                <span>${product.name} - Цена: ${product.price}₽ (${product.description})</span>
                <input type="checkbox" value="${product.id}">
                <button class="update-product-button" data-id="${product.id}">Обновить товар</button>
            `;
            productList.appendChild(productDiv);
        });

        productListContainer.style.display = 'block';
        overlay.style.display = 'none';

        // Обработчик кнопки подтверждения удаления
        document.getElementById('confirmDeleteButton').onclick = () => deleteSelectedProducts(products);

        // Обработчик кнопки отмены
        document.getElementById('cancelDeleteButton').onclick = () => {
            productListContainer.style.display = 'none';
        };

        addUpdateProductListeners(); // Добавляем слушатели для кнопок обновления
    }

    // Функция для удаления выбранных продуктов
    async function deleteSelectedProducts(products) {
        const selectedIds = Array.from(document.querySelectorAll('#productList input[type="checkbox"]:checked')).map(cb => cb.value);

        overlay.style.display = 'flex';

        try {
            const deletePromises = selectedIds.map(id => {
                return fetch(`http://127.0.0.1:8000/api/products/${id}`, {
                    method: 'DELETE',
                });
            });

            const results = await Promise.all(deletePromises);
            const allDeleted = results.every(response => response.ok);

            if (allDeleted) {
                alert('Товары успешно удалены!');
            } else {
                alert('Ошибка при удалении некоторых товаров.');
            }
        } catch (error) {
            console.error('Ошибка при удалении товаров:', error);
            alert('Произошла ошибка при удалении товаров');
        } finally {
            overlay.style.display = 'none';
            productListContainer.style.display = 'none';
        }
    }

    // Загрузка категорий для удаления
    async function loadCategoriesForDeletion() {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/categories');
            const data = await response.json();
            const categories = data['member'];

            categoryToDeleteSelect.innerHTML = ''; // Очищаем предыдущие категории
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Выберите категорию для удаления';
            categoryToDeleteSelect.appendChild(defaultOption);

            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categoryToDeleteSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Ошибка загрузки категорий:', error);
        }
    }

    // Обработчик кнопки удаления категории
    const deleteCategoryButton = document.getElementById('deleteCategoryButton'); // Получаем элемент кнопки
    if (deleteCategoryButton) {
        deleteCategoryButton.addEventListener('click', () => {
            deleteCategoryContainer.style.display = 'block'; // Показываем форму удаления
            loadCategoriesForDeletion(); // Загружаем категории для удаления
        });
    }

    // Обработчик кнопки подтверждения удаления категории
    const confirmDeleteCategoryButton = document.getElementById('confirmDeleteCategoryButton');
    if (confirmDeleteCategoryButton) {
        confirmDeleteCategoryButton.addEventListener('click', async () => {
            const selectedCategoryId = categoryToDeleteSelect.value;

            if (!selectedCategoryId) {
                alert('Пожалуйста, выберите категорию для удаления.');
                return;
            }

            overlay.style.display = 'flex'; // Показываем индикатор загрузки

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/categories/${selectedCategoryId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Категория успешно удалена!');
                    deleteCategoryContainer.style.display = 'none'; // Скрываем форму удаления
                    loadCategories(); // Перезагружаем категории
                } else {
                    const errorData = await response.json();
                    alert(`Ошибка при удалении категории: ${errorData.message || response.statusText}`);
                }
            } catch (error) {
                console.error('Ошибка при удалении категории:', error);
                alert('Произошла ошибка при удалении категории');
            } finally {
                overlay.style.display = 'none'; // Скрываем индикатор загрузки
            }
        });
    }

    // Обработчик кнопки "Отмена" для удаления категории
    const cancelDeleteCategoryButton = document.getElementById('cancelDeleteCategoryButton');
    if (cancelDeleteCategoryButton) {
        cancelDeleteCategoryButton.addEventListener('click', () => {
            deleteCategoryContainer.style.display = 'none'; // Скрываем форму удаления
        });
    }

    // Функция для загрузки информации о товаре для обновления
    async function loadProductForUpdate(productId) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/products/${productId}`);
            const product = await response.json();

            // Заполняем поля формы обновления
            document.getElementById('updateProductId').value = product.id; // Записываем ID
            document.getElementById('updateProductName').value = product.name;
            document.getElementById('updateProductPrice').value = product.price;
            document.getElementById('updateProductDescription').value = product.description;
            // Здесь нужно загрузить категории, чтобы выбрать правильную категорию
            document.getElementById('updateCategorySelect').value = product.category.id; // Предполагаем, что category.id доступен

            document.getElementById('updateProductForm').style.display = 'block'; // Показываем форму
        } catch (error) {
            console.error('Ошибка загрузки товара для обновления:', error);
        }
    }

    // Добавление обработчиков событий на кнопки обновления
    function addUpdateProductListeners() {
        const updateButtons = document.querySelectorAll('.update-product-button');
        updateButtons.forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-id');
                loadProductForUpdate(productId); // Загружаем информацию о товаре для обновления
            });
        });
    }

    // Обработчик кнопки "Обновить товар"
    const submitUpdateProductButton = document.getElementById('submitUpdateProductButton');
    if (submitUpdateProductButton) {
        submitUpdateProductButton.addEventListener('click', async () => {
            const productId = document.getElementById('updateProductId').value; // Получаем ID товара
            const productName = document.getElementById('updateProductName').value;
            const productPrice = document.getElementById('updateProductPrice').value;
            const productDescription = document.getElementById('updateProductDescription').value;
            const categoryId = document.getElementById('updateCategorySelect').value;

            overlay.style.display = 'flex'; // Показываем индикатор загрузки

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/products/${productId}`, {
                    method: 'PUT', // Используем метод PUT для обновления
                    headers: {
                        'Content-Type': 'application/ld+json',
                    },
                    body: JSON.stringify({
                        name: productName,
                        description: productDescription,
                        price: parseFloat(productPrice),
                        category: `/api/categories/${categoryId}`,
                    }),
                });

                if (response.ok) {
                    alert('Товар успешно обновлен!');
                    document.getElementById('updateProductForm').style.display = 'none'; // Скрываем форму
                    loadProductsWithCheckboxes(currentPage); // Обновляем список товаров
                } else {
                    const errorData = await response.json();
                    alert(`Ошибка при обновлении товара: ${errorData.message || response.statusText}`);
                }
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Произошла ошибка при обновлении товара');
            } finally {
                overlay.style.display = 'none'; // Скрываем индикатор загрузки
            }
        });
    }

    // Загрузка формы для обновления категории
    async function loadCategoryForUpdate(categoryId) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/categories/${categoryId}`);
            const category = await response.json();

            // Заполняем поля формы обновления
            document.getElementById('updateCategoryId').value = category.id; // Записываем ID
            document.getElementById('updateCategoryName').value = category.name;

            document.getElementById('updateCategoryForm').style.display = 'block'; // Показываем форму
        } catch (error) {
            console.error('Ошибка загрузки категории для обновления:', error);
        }
    }

    // Обработчик кнопки "Обновить категорию"
    const submitUpdateCategoryButton = document.getElementById('submitUpdateCategoryButton');
    if (submitUpdateCategoryButton) {
        submitUpdateCategoryButton.addEventListener('click', async () => {
            const categoryId = document.getElementById('updateCategoryId').value; // Получаем ID категории
            const categoryName = document.getElementById('updateCategoryName').value;

            overlay.style.display = 'flex'; // Показываем индикатор загрузки

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/categories/${categoryId}`, {
                    method: 'PUT', // Используем метод PUT для обновления
                    headers: {
                        'Content-Type': 'application/ld+json',
                    },
                    body: JSON.stringify({
                        name: categoryName,
                    }),
                });

                if (response.ok) {
                    alert('Категория успешно обновлена!');
                    document.getElementById('updateCategoryForm').style.display = 'none'; // Скрываем форму
                    loadCategories(); // Обновляем список категорий
                } else {
                    const errorData = await response.json();
                    alert(`Ошибка при обновлении категории: ${errorData.message || response.statusText}`);
                }
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Произошла ошибка при обновлении категории');
            } finally {
                overlay.style.display = 'none'; // Скрываем индикатор загрузки
            }
        });
    }

    // Обработчик кнопки "Отмена" для обновления товара
    const cancelUpdateProductButton = document.getElementById('cancelUpdateProductButton');
    if (cancelUpdateProductButton) {
        cancelUpdateProductButton.addEventListener('click', () => {
            document.getElementById('updateProductForm').style.display = 'none'; // Скрываем форму
        });
    }

    // Обработчик кнопки "Отмена" для обновления категории
    const cancelUpdateCategoryButton = document.getElementById('cancelUpdateCategoryButton');
    if (cancelUpdateCategoryButton) {
        cancelUpdateCategoryButton.addEventListener('click', () => {
            document.getElementById('updateCategoryForm').style.display = 'none'; // Скрываем форму
        });
    }

    // Инициализация
    loadCategories(); // Загружаем категории при загрузке страницы
});
