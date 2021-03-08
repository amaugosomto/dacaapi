const config = require("../config/config");
const domain = "http://localhost:4000"

const getMailBody = (id, token) => {
    return `
        <head>
    <link href="https://fonts.googleapis.com/css?family=Roboto|Yeon+Sung&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Roboto', sans-serif;
        }

        .container {
            padding: 20px 60px;
        }

        #logo {
            display: flex;
            align-items: center;
        }

        span {
            font-family: 'Yeon Sung', cursive;
            font-weight: 600;
            font-size: 2rem;
            padding-left: 5px;
            color: #6D0EB5;
        }

        h5 {
            color: rgba(0, 0, 0, 0.7);
            font-size: 1.1rem;
        }

        h5:last-of-type {
            color: rgba(0, 0, 0, 0.37)
        }

        a {
            text-decoration: underline;
            display: inline-block;
            -webkit-transition: 0.5s;
            transition: 0.5s;
        }

        a#activate {
            text-transform: uppercase;
            text-decoration: none;
            background-color: #6D0EB5;
            padding: 10px 40px;
            border-radius: 50px;
            font-size: 15px;
            font-weight: 500;
            color: #fff;
            text-transform: uppercase;
        }

        a#activate:hover {
            background-color: #fff;
            color: #6D0EB5;
            border: 1px solid #6D0EB5;
            
        }
    </style>
</head>

<body>
    <div class="container">
        <div id="logo">
            <span>DACA-NG</span>
        </div>

        <div id="content">
            <h5>
                Thanks for signing up with DACA-NG!.
            </h5>
            <p> We are happy to welcome you aboard </p>
            <p> Please click on the link to activate your account </p>
            <a id="activate" href="${domain}/activate?id=${id}&token=${token}">activate</a>
            <h5>Have fun, and don't hestiate to contact us with your feedback.</h5>

            <h5>iGofer Team</h5>
            <a href="${domain}">DACA-NG</a>

            <hr>
            <h5>
            To model the nature of God(love) and a culture of excellence while delivering selfless service
            </h5>
        </div>
    </div>
</body>
    `;
}

module.exports = getMailBody;