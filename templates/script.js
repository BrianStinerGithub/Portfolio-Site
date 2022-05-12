function LikeButtonClicked(el) {
    console.log(el);
    if (el.textContent === 'thumb_up') {
        el.textContent = 'thumb_down';
    } else {
        el.textContent = 'thumb_up';
    }
}
