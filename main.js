ymaps.ready(init);

Date.prototype.yyyymmdd = function () {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [
    (dd > 9 ? '' : '0') + dd,
    (mm > 9 ? '' : '0') + mm + '.',
    this.getFullYear() + '.',
  ].join('');
};

function init() {
  // Создание карты.
  const map = new ymaps.Map('map', {
    // Координаты центра карты.
    // Порядок по умолчанию: «широта, долгота».
    // Чтобы не определять координаты центра карты вручную,
    // воспользуйтесь инструментом Определение координат.
    center: [55.75, 37.6],
    // Уровень масштабирования. Допустимые значения:
    // от 0 (весь мир) до 19.
    zoom: 13,
  });

  map.events.add('click', function (e) {
    const placemark = new ymaps.Placemark(e.get('coords'), {
      hintContent: 'Оставить отзыв.',
      balloonContent: `
          <div class="placemark">
            <h2 class="placemark__title">Отзыв:</h2>
            <input name="name" placeholder="Укажите ваше имя" type="text" class="input placemark__input">
            <input name="place" placeholder="Укажите место" type="text" class="input placemark__input">
            <textarea name="review" placeholder="Оставить отзыв" id="" cols="30" rows="10"
                  class="textarea placemark__textarea"></textarea>
            <button class="btn placemark__btn" onclick="
            const placemark = document.querySelector('.placemark');
            const nameInput = placemark.querySelector('.placemark__input[name=name]');
            const placeInput = placemark.querySelector('.placemark__input[name=place]');
            const reviewInput = placemark.querySelector(
              '.placemark__textarea[name=review]'
            );
            let reviewContainer = placemark.querySelector('.placemark__review-container');
  
            const review = document.createElement('div');
            const name = document.createElement('span');
            name.textContent = nameInput.value;
            review.textContent =
              ' ' +
              placeInput.value +
              ' ' +
              new Date().yyyymmdd() +
              ' ' +
              reviewInput.value;
  
            if (placeInput.value.trim() && reviewInput.value.trim() && nameInput.value.trim()) {
              review.prepend(name);
              review.classList.add('placemark__review');
  
              if (!reviewContainer) {
                reviewContainer = document.createElement('div');
                reviewContainer.classList.add('placemark__review-container');
              }
              reviewContainer.appendChild(review);
              placemark.prepend(reviewContainer);
              nameInput.value = '';
              placeInput.value = '';
              reviewInput.value = '';
            }
            ">Добавить</button>
           </div>
        `,
    });

    map.geoObjects.add(placemark);
  });
}
