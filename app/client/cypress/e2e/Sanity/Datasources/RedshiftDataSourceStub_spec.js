const datasource = require("../../../locators/DatasourcesEditor.json");
let datasourceName;
import { ObjectsRegistry } from "../../../support/Objects/Registry";

describe("Redshift datasource test cases", function () {
  beforeEach(() => {
    cy.startRoutesForDatasource();
  });

  it("1. Create, test, save then delete a Redshift datasource", function () {
    cy.NavigateToDatasourceEditor();
    cy.get(datasource.Redshift).click();
    cy.fillRedshiftDatasourceForm();
    cy.generateUUID().then((UUID) => {
      datasourceName = `Redshift MOCKDS ${UUID}`;
      cy.renameDatasource(datasourceName);
    });
    cy.intercept("POST", "/api/v1/datasources/test", {
      fixture: "testAction.json",
    }).as("testDatasource");
    cy.testSaveDatasource(false);
  });

  it("2. Create with trailing white spaces in host address and database name, test, save then delete a Redshift datasource", function () {
    cy.NavigateToDatasourceEditor();
    cy.get(datasource.Redshift).click();
    cy.fillRedshiftDatasourceForm(true);
    cy.generateUUID().then((UUID) => {
      datasourceName = `Redshift MOCKDS ${UUID}`;
      cy.renameDatasource(datasourceName);
    });
    cy.intercept("POST", "/api/v1/datasources/test", {
      fixture: "testAction.json",
    }).as("testDatasource");
    cy.testSaveDatasource(false);
    cy.deleteDatasource(datasourceName);
  });

  it("3. Create a new query from the datasource editor", function () {
    ObjectsRegistry.DataSources.CreateQueryForDS(datasourceName);
    cy.wait("@createNewApi").should(
      "have.nested.property",
      "response.body.responseMeta.status",
      201,
    );
    cy.deleteQueryUsingContext();
    cy.deleteDatasource(datasourceName);
  });
});
