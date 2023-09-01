![Delish Savory](https://github.com/samiur-r/DelishSavory-OpenSource/assets/67631118/c196dc65-6e16-4d20-93a1-5a137f98ef54)



# DelishSavory Open Source

This is the open source version of Delish Savory which is a Recipe Book app that helps users discover, save, and organize their favorite recipes. Whether you're a seasoned chef or a beginner in the kitchen, DelishSavory makes it easy to find, cook, and share delicious recipes.

## Project Structure

The DelishSavory is organized into the following directories:

- **api**: Contains the source code for the DelishSavory API, which provides backend services for the mobile app.
- **app**: Contains the source code for the DelishSavory React Native mobile app, where users can discover and manage their favorite recipes.

## Technologies Used

The DelishSavory project utilizes the following technologies, languages, frameworks, and packages:

- **API (Express.js)**:
  - Language: Typescript/Node.js
  - Framework: Express.js
  - Database: PostgreSQL
  - ORM: TypeORM
  - Additional Packages: Helmet, Morgan, Multer, Winston, Yup

- **Mobile App (React Native)**:
  - Language: TypeScript
  - Framework: React Native

## Getting Started

To get started with the DelishSavory, follow these steps:

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/samiur-r/delish-savory-open-source.git
   cd delish-savory-open-source
   ```
   
2. Set Up the API:

   ```bash
   cd api
   cp .env.example env.example 
  
   Open the env.example file and add values to the environment variables.

   yarn install
   yarn run dev
   ```

3. Set Up the APP:

   ```bash
   cd app
   cp .env.example env.example 
  
   Open the env.example file and add values to the environment variables.
   
   yarn install
   yarn start
   yarn run android or yarn run ios
   ```

## Contributing

- Create a new branch from 'develop' with a standard name(e.g. feat/create-x-feature, hotfix/x-bug).
- Code, test, commit and push your branch. Create a PR into 'develop'.
- Ask for PR review from an appropriate reviewer.

## Contact

If you have any questions or feedback, feel free to contact us:

- Email: samiur.rahman.akif@gmail.com
- GitHub Issues: https://github.com/samiur-r/delish-savory-open-source.git/issues
