# OS Portfolio

Welcome to OS Portfolio! This project is a customizable portfolio template built with Vue.js. It allows you to showcase your applications and organize them on a desktop-like interface.

https://github.com/AvishakeAdhikary/OS-Portfolio/assets/32614982/bdca6f60-0aaf-4579-83dc-a668c73ac73b

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Technologies](#technologies)
- [License](#license)

## Installation

To get started with OS Portfolio, follow the instructions below:

1. Clone the repository to your local machine using the following command:

```shell
git clone https://github.com/AvishakeAdhikary/OS-Portfolio.git
```

Change into the project directory:
```shell
cd OS-Portfolio
```
Install the dependencies by running:
```shell
npm install
```
Build the project using:
```shell
npm run build
```
## Usage
Once the installation is complete, you can run the project locally by executing:

```shell
npm run dev
```

This will start a development server, and you can access the application in your browser at http://localhost:3000.

To customize the portfolio with your own applications and content, follow these steps:

1. Modify the Desktop.vue component located at src/components/Desktop.vue. This is where you can add, remove, or rearrange your applications.
2. Customize each application by creating separate components in the Applications directory located at src/components/Desktop/Applications. Each component represents an individual application and can be styled and designed according to your needs.
3. Update the Window.vue component located at src/components/Window.vue to adjust the behavior and appearance of the window.
4. Feel free to modify the styles in the style blocks within the component files or update the global styles in App.vue as per your preference.

## Contributing
Contributions are welcome! If you have any ideas, improvements, or bug fixes, please follow these steps:

1. Fork the repository.
2. Create a new branch with a descriptive name for your feature or bug fix.
3. Make your modifications and ensure that everything is working correctly.
4. Commit your changes and push the branch to your forked repository.
5. Open a pull request on the main repository, providing a clear description of your changes.
6. Wait for the maintainers to review your pull request. Your contribution will be greatly appreciated!

## Technologies
The following technologies are used in this project:

- Vue.js: ^3.3.2
- VueDraggable: ^2.24.3
- Vite: ^4.3.5
- @vitejs/plugin-vue: ^4.2.3

## License
This project is licensed under the MIT License.
