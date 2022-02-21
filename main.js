ymaps.ready(init);

Date.prototype.yyyymmdd = function () {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [
    (dd > 9 ? '' : '0') + dd + '.',
    (mm > 9 ? '' : '0') + mm + '.',
    this.getFullYear(),
  ].join('');
};

const placemarks = [];

function init() {
  // Создание карты.
  const map = new ymaps.Map('map', {
    // Координаты центра карты.
    // Порядок по умолчанию: «широта, долгота».
    // Чтобы не определять координаты центра карты вручную,
    // воспользуйтесь инструментом Определение координат.
    center: [55.75, 37.66],
    // Уровень масштабирования. Допустимые значения:
    // от 0 (весь мир) до 19.
    zoom: 13,
  });

  map.events.add('click', function (e) {
    const coords = e.get('coords');
    const BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
        `<div class="balloon-root ">
          <span class="close" href="#"></span>
          <div class="arrow balloon-pin"></div>
          <div class="balloon-body balloon">
            <div class="balloon__wrapper">
                <div class="placemark" id="placemark">
                    <h2 class="placemark__title">Отзыв:</h2>
                    <input name="name" placeholder="Укажите ваше имя" type="text" class="input placemark__input">
                    <input name="place" placeholder="Укажите место" type="text" class="input placemark__input">
                    <textarea name="review" placeholder="Оставить отзыв" id="" cols="30" rows="10"
                        class="textarea placemark__textarea"></textarea>
                    <button class="btn placemark__btn">Добавить</button>
                </div>
            </div>
          </div>
        </div>`, {
          //Формирование макета
          build: function () {
            this.constructor.superclass.build.call(this);
            this._$element = $('.balloon-root', this.getParentElement());
            this.applyElementOffset();
            this._$element.find('.close')
                .on('click', $.proxy(this.onCloseClick, this));
            this._$element.find('.placemark__btn')
                .on('click', $.proxy(this.balloonBtnHandler, this));

              const oldPlacemark = placemarks.find(placemark => placemark.coords === coords);
              if(oldPlacemark) {
                  $('#placemark').prepend(oldPlacemark.reviewContainer);
              }
          },
          //удаление макета из DOM
          clear: function () {
            this._$element.find('.close')
                .off('click');
            this.constructor.superclass.clear.call(this);
          },
          //закрытие балуна
          onCloseClick: function (e) {
            e.preventDefault();
            this.events.fire('userclose');
          },
          //вешаем обработчик на кнопку внутри балуна
          balloonBtnHandler: function (e) {
              e.preventDefault();

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
                  const oldPlacemark = placemarks.find(placemark => placemark.coords === coords);
                  if(oldPlacemark) {
                      oldPlacemark.reviewContainer = reviewContainer;
                  } else {
                      placemarks.push({coords, reviewContainer})
                  }
                  placemark.prepend(reviewContainer);
                  nameInput.value = '';
                  placeInput.value = '';
                  reviewInput.value = '';
              }
          },
          //Сдвигаем балун, чтобы "хвостик" указывал на точку привязки.
          applyElementOffset: function () {
            this._$element.css({
              left: -(this._$element[0].offsetWidth / 2),
              top: -(this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight)
            });
          },

        });

    const placemark = new ymaps.Placemark(coords, {}, {
      balloonShadow: true,
      balloonLayout: BalloonContentLayout,
      // Запретим замену обычного балуна на балун-панель.
      // Если не указывать эту опцию, на картах маленького размера откроется балун-панель.
      balloonPanelMaxMapArea: 1
    });

    map.geoObjects.add(placemark);
    })
}
