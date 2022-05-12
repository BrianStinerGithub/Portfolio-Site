
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('likeButton').addEventListener('click', LikeButtonClicked);
});

function LikeButtonClicked(el) {
    console.log(el.target.textContent);
    if (el.target.textContent === 'thumb_up') {
        el.target.textContent = 'thumb_down';
    } else {
        el.target.textContent = 'thumb_up';
    }
}
