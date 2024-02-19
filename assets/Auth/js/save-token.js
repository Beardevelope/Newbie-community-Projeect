const handleGoogleAuthBack = async () => {
    try {
        const currentUrl = window.location.search;

        const urlSearchParams = new URLSearchParams(currentUrl);

        console.log(urlSearchParams)
        const param1Value = urlSearchParams.get('accessToken')
        console.log(param1Value)
        if (param1Value) {
            sessionStorage.setItem('accessToken', param1Value)
            window.location.href = '/'
        }
    } catch (error) {
        console.error(error)
        alert('error')
    }
}
handleGoogleAuthBack()