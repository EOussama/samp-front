$(document).ready(() => {
    const config = {
        /**
         * The auto scroll's speed in milliseconds.
         */
        scrollSpeed: 500,

        /**
         * The live stats update interval in milliseconds.
         */
        liveUpdateInterval: 3000
    };

    // #region Scroll down button press.
    $('#scroll-down-btn').on('click', () => {
        $('html').animate({
            scrollTop: ($('header').outerHeight() + $('nav').outerHeight()) + 1
        }, config['scrollSpeed']);
    });
    // #endregion

    // #region Scroll to about
    $('#about-btn').on('click', () => {
        $('html').animate({
            scrollTop: $('footer').offset().top
        }, config['scrollSpeed']);
    });
    // #endregion

    // #region Scroll to live stats
    $('#live-stats-btn').on('click', () => {
        $('html').animate({
            scrollTop: $('#live-stats').offset().top - 50
        }, config['scrollSpeed']);
    });
    // #endregion

    // #region Scroll to top
    $('#scroll-top').on('click', () => {
        $('html').animate({
            scrollTop: 0
        }, config['scrollSpeed']);
    });
    // #endregion

    // #region Live update

    const
        $serverInfo = {
            "hostname": $('#server-hostname'),
            "version": $('#server-version'),
            "gamemode": $('#server-gamemode'),
            "mapname": $('#server-mapname'),
            "language": $('#server-language'),
            "players": $('#server-players'),
            "password": $('#server-password')
        },
        $playersStats = $('#player-stats-content'),
        $playerCount = $('#player-count');

    setInterval(() => {
        try {
            fetch('utils/live-update.php')
            .then(response => response.json())
            .then(data => {
                if (!data.hasOwnProperty('error')) {
    
                    // Updating the server's info.
                    $serverInfo["hostname"].text(data.info.hostname);
                    $serverInfo["version"].text(data.rules.version);
                    $serverInfo["gamemode"].text(data.info.gamemode);
                    $serverInfo["mapname"].text(data.rules.mapname);
                    $serverInfo["language"].text(data.info.mapname);
                    $serverInfo["players"].text(`${ data.players.length } / ${ data.info.maxplayers }`);
                    $serverInfo["password"].text(`${ data.info.password ? "Yes" : "No" }`);
    
                    // Updating the player count.
                    $playerCount.text(`${ data.players.length } / ${ data.info.maxplayers }`);
    
                    // Updating the players' list.
                    $playersStats.text("");
                    $.each(data.players, (i, v) => {
                        $playersStats.append(`
                            <tr>
                                <td>${ v.playerid }</td>
                                <td>${ v.nickname }</td>
                                <td>${ v.score }</td>
                                <td>${ v.ping }</td>
                            </tr>
                        `);
                    });
                } else {
                    throw new Exception('[error] - ' + data.error);
                }
    
                console.log('updated');
            });
        }
        catch(e) {
            console.log('exception: ' + e);
        }
    }, config['liveUpdateInterval']);

    // #endregion
});

$(document).on('scroll', (e) => {
    if ($(window).scrollTop() > ($('header').outerHeight() + $('nav').outerHeight())) {

        // Sticking the navbar.
        $('nav').addClass('sticky');

        // Adding some margin top to the header.
        $('header').addClass('sticky');

        // Displaying the back to top button.
        $('#scroll-top').css('display', 'block');
    } else {

        // Fixing the navbar.
        $('nav').removeClass('sticky');

        // Removing the extra margin top from the header.
        $('header').removeClass('sticky');

        // Hidding the back to top button.
        $('#scroll-top').css('display', 'none');
    }
});

window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});