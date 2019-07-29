function graphSlidedown() {
    $(document).ready(function() {
        // $('#chart-main').removeClass('chart')
        // $('#chart-main').addClass('chart-active')
        $('.chart').slideUp(1000)
            // $('.chart').css('display', 'block')


    })
}


function graphSlideUp() {
    $(document).ready(function() {
        // $('#chart-main').removeClass('chart')
        // $('#chart-main').addClass('chart-active')
        $('.chart').slideDown(1000)
            // $('.chart').css('display', 'block')


    })
}


function togglegraph() {
    $(document).ready(function() {
        // $('#chart-main').removeClass('chart')
        $('#chart-main').addClass('chart-active')
        $('.chart-active ').slideToggle(1000)

    })
}



function toggleVolumeBtn() {
    $(document).ready(function() {
        $('.volume__calculator').slideToggle(500)

    })
}

function SlideDownVolumeBtn() {
    $(document).ready(function() {
        $('.volume__calculator').slideUp(1000)

    })
}