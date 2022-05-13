document.addEventListener('DOMContentLoaded', function () {
    document.getElementsByClassName('left')[0].addEventListener('click', function (el) {
});

function LikeButtonClicked(el) {
    console.log(el.target.textContent);
    if (el.target.textContent === 'thumb_up') {
        el.target.textContent = 'thumb_down';
    } else {
        el.target.textContent = 'thumb_up';
    }
}