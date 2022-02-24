import InteractiveMap from "./interactiveMap";

export default class GeoReview {
    constructor() {
        this.formTemplate = document.querySelector('#addFormTemplate').innerHTML;
        this.map = new InteractiveMap('map', this.onClick.bind(this));
        this.map.init().then(this.onInit.bind(this));
    }

    async onInit() {
        const placemarks = JSON.parse(localStorage.getItem('placemarks'));

        if(placemarks) {
            for(const coords in placemarks) {
                this.map.createPlacemark(coords);
            }
        } else {
            localStorage.setItem('placemarks', JSON.stringify({}))
        }

        document.body.addEventListener('click', this.onDocumentClick.bind(this));
    }

    createForm(coords, reviews) {
        const root = document.createElement('div');
        root.innerHTML = this.formTemplate;
        const reviewList = root.querySelector('.review-list');
        const reviewForm = root.querySelector('[data-role=review-form]');
        reviewForm.dataset.coords = JSON.stringify(coords);

        for(const item of reviews) {
            const div = document.createElement('div');
            div.classList.add('review-item');
            div.innerHTML = `
            <div>
                <b>${item.name}</b>[${item.place}]
            </div>
            <div>${item.text}</div>
            `;
            reviewList.appendChild(div);
        }

        return root;
    }

    onClick(coords) {
        const placemarks = JSON.parse(localStorage.getItem('placemarks'));
        const list = placemarks && placemarks[coords] || [];
        const form = this.createForm(coords, list);
        this.map.openBalloon(coords, form.innerHTML);
    }

    async onDocumentClick(e) {
        if(e.target.dataset.role === 'review-add') {
            const reviewForm = document.querySelector('[data-role=review-form]');
            const coords = JSON.parse(reviewForm.dataset.coords);
            const placemarks = JSON.parse(localStorage.getItem('placemarks'));
            let reviews = [{
                name: document.querySelector('[data-role=review-name]').value,
                place: document.querySelector('[data-role=review-place]').value,
                text: document.querySelector('[data-role=review-text]').value,
            }];

            if(placemarks[coords]) {
                placemarks[coords] = [...placemarks[coords], ...reviews]
            } else {
                placemarks[coords] = reviews;
            }

            localStorage.setItem('placemarks', JSON.stringify(placemarks));
            this.map.createPlacemark(coords);
            this.map.closeBalloon();
        }
    }
}