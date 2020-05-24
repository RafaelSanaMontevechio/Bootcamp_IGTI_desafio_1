const URL =
  'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo';

let allUsers = [];

let inputName = null;
let usersFound = null;
let statistics = null;
let male = 0;
let female = 0;
let totalAges = 0;
let avarageAges = 0;

let numberFormat = null;

window.addEventListener('load', () => {
  getAllUsersFromApi();
  usersFound = document.querySelector('#usersFound');
  statistics = document.querySelector('#statistics');
  inputName = document.querySelector('#name');
  inputName.addEventListener('keyup', filter);

  numberFormat = Intl.NumberFormat('pt-BR');
});

const getAllUsersFromApi = async () => {
  const res = await fetch(URL);
  const json = await res.json();
  allUsers = json.results.map((user) => {
    return {
      firstName: user.name.first,
      lastName: user.name.last,
      picture: user.picture.large,
      age: user.dob.age,
      gender: user.gender,
    };
  });
};

const filter = async (event) => {
  let str = event.target.value.toLowerCase().trim();
  let users = [];
  if (str != '') {
    if (users.length) {
      renderSpinner();
    }
    users = filterUsers(str);
    renderUserFiltered(users);
  } else {
    renderUserFiltered(users);
  }
};

const filterUsers = (str) => {
  let temp = allUsers.filter((user) => {
    return (
      user.firstName.toLowerCase().includes(str) ||
      user.lastName.toLowerCase().includes(str)
    );
  });

  return temp;
};

const renderUserFiltered = (x) => {
  let usersHTML = '<div>';
  let totalUsers = x.length;

  usersHTML += `<h5>
                   ${totalUsers} Usuário(s) encontrado(s)
                </h5>`;

  x.forEach((user) => {
    const { picture, firstName, lastName, age } = user;
    const userHTML = `
    <div class="user">
      <img src=${picture} />
        <div class="info">
          <p> ${firstName} ${lastName},  ${age} anos </p>
        </div>
    </div>
    `;
    usersHTML += userHTML;
  });
  usersHTML += '</div>';
  usersFound.innerHTML = usersHTML;
  calcStatistics(x);
};

const calcStatistics = (data) => {
  let tempMale = data.filter((user) => {
    return user.gender === 'male';
  });
  male = tempMale.length;

  let tempFemale = data.filter((user) => {
    return user.gender === 'female';
  });
  female = tempFemale.length;

  totalAges = data.reduce((acc, curr) => {
    return acc + curr.age;
  }, 0);

  if (data.length != 0) {
    avarageAges = (totalAges / data.length).toFixed(2);
  } else {
    avarageAges = 0;
  }
  renderStatistics();
};

const renderStatistics = () => {
  totalAges = formatNumber(totalAges);
  let allDataHTML = '<div>';
  allDataHTML += ' <h5>Estatísticas</h5>';
  let data = `
  <p>Sexo masculino: <strong>${male} </strong></p>
  <p>Sexo feminino: <strong>${female} </strong></p>
  <p>Soma das idades: <strong>${totalAges} </strong></p>
  <p>Média das idades: <strong>${avarageAges} </strong></p>
  `;
  allDataHTML += data;
  allDataHTML += '</div>';
  statistics.innerHTML = allDataHTML;
};

const renderSpinner = () => {
  const spinnerHTML = " <div class='spinner'></div";
  usersFound.innerHTML = spinnerHTML;
};

function formatNumber(number) {
  return numberFormat.format(number);
}
