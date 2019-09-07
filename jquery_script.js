// function graphSlidedown() {
//     $(document).ready(function() {
//         $('.chart').slideUp(1000)     
//  })
// }


// function graphSlideUp() {
//     $(document).ready(function() {
//         $('.chart').slideDown(1000)
//             // var graphUp = 1

//     })
// }


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