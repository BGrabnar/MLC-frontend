import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintStream;
import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.DrbgParameters.Reseed;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

import org.apache.jena.ontology.OntModel;
import org.apache.jena.ontology.OntModelSpec;
import org.apache.jena.ontology.OntProperty;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.riot.RDFFormat;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.google.gson.JsonArray;
import com.google.gson.JsonIOException;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;

public class AnnotateMLCdata {
	
	public static String URIprefix = "http://www.ontodm.com/OntoDM-core/ontoexp_annotations";
	public JsonArray ontologyJSON;
	public Model model = ModelFactory.createDefaultModel();
	public Annotator annotator = new Annotator(model, URIprefix);
	
	public AnnotateMLCdata(JsonArray myOnt) {
		this.ontologyJSON = myOnt;
	}
	
	// Resources that represent classes
	Resource train_test_dataset_assignment_class;
	Resource predictive_model_train_test_evaluation_workflow_execution_class;
	Resource DM_dataset_class;
	Resource dataset_role_class;
	Resource test_set_role_class;
	Resource train_set_role_class;
	Resource predictive_model_train_test_evaluation_workflow_implementation_class;
	Resource predictive_model_class;
	Resource predictive_modelling_algorithm_execution_class;
	Resource predictive_modelling_algorithm_implementation_class;
	Resource predictive_model_execution_class;
	Resource predictive_model_execution_on_test_set_class;
	Resource predictive_model_execution_on_train_set_class;
	Resource predicted_set_role_class;
	Resource predictive_model_test_set_evaluation_calculation_class;
	Resource evaluation_measure_calculation_class;
	Resource predictive_modelling_evaluation_calculation_implementation_class;
	Resource evaluation_measure_class;




	
	Resource[] evaluation_measure_classes = new Resource[20];
	
	//cross validation folds classes
	Resource N_fold_cross_validation_evaluation_workflow_execution_class;
	Resource N_fold_cross_validation_sampling_process_class;
	Resource set_of_folds_class;
	Resource fold_class;
	Resource per_fold_evaluation_workflow_execution_class;
	Resource CV_train_test_dataset_assignment_class;
	Resource N_fold_evaluation_measure;
	
	// evaluation measure resources that represent classes
	Resource testing_time_class;
	Resource training_time_class;
	Resource accuracy_class;
	Resource F1_score_class;
	Resource hamming_loss_class;
	Resource precision_class;
	Resource recall_class;
	Resource subset_accuracy_class;
	Resource AUPRC_class;
	Resource AUROC_class;
	Resource macro_F1_score_class;
	Resource macro_precision_class;
	Resource macro_recall_class;
	Resource micro_F1_score_class;
	Resource micro_precision_class;
	Resource micro_recall_class;
	Resource average_precision_class;
	Resource coverage_class;
	Resource one_error_class;
	Resource ranking_loss_class;


	//newly added resources
	Resource DM_dataset_sampling_class;
	Resource sampling_technique_class;


	
	// Properties
	OntProperty precedes;
	OntProperty preceded_by;
	OntProperty has_part;
	OntProperty has_participant;
	OntProperty has_specified_input;
	OntProperty is_specified_input_of;
	OntProperty has_specified_output;
	OntProperty has_quality;
	OntProperty has_role;
	OntProperty is_concretization_of;
	OntProperty is_realized_by;
	OntProperty originates_from;
	OntProperty participates_in;
	OntProperty is_specified_output_of;
	OntProperty realizes;
	OntProperty role_of;
	OntProperty has_evaluation_measure;
	OntProperty has_input;

	OntProperty denoted_by;
	OntProperty has_value;
	OntProperty number_of_examples;
	OntProperty number_of_folds;
	OntProperty algorithm_name;

	//newly added properties
	OntProperty is_about;

	public void addProperties(String[] evaluation_measures) {
		OntModel ontModel = ModelFactory.createOntologyModel(OntModelSpec.OWL_DL_MEM);
		
		// creating URIs for the resources
		train_test_dataset_assignment_class = model.createResource(annotator.findURI(ontologyJSON, "train/test dataset assignment"));
		predictive_model_train_test_evaluation_workflow_execution_class = model.createResource(annotator.findURI(ontologyJSON, "predictive model train/test evaluation workflow execution"));
		DM_dataset_class = model.createResource(annotator.findURI(ontologyJSON, "DM-dataset"));
		dataset_role_class = model.createResource(annotator.findURI(ontologyJSON, "dataset role"));
		test_set_role_class = model.createResource(annotator.findURI(ontologyJSON, "test set role"));
		train_set_role_class = model.createResource(annotator.findURI(ontologyJSON, "train set role"));
		predictive_model_train_test_evaluation_workflow_implementation_class = model.createResource(annotator.findURI(ontologyJSON, "predictive model train/test evaluation workflow implementation"));
		predictive_modelling_algorithm_execution_class = model.createResource(annotator.findURI(ontologyJSON, "predictive modelling algorithm execution"));
		predictive_modelling_algorithm_implementation_class = model.createResource(annotator.findURI(ontologyJSON, "predictive modelling algorithm implementation"));
		predictive_model_class = model.createResource(annotator.findURI(ontologyJSON, "predictive model"));
		predictive_model_execution_class = model.createResource(annotator.findURI(ontologyJSON, "predictive model execution"));
		predictive_model_execution_on_test_set_class = model.createResource(annotator.findURI(ontologyJSON, "predictive model execution on test set"));
		predictive_model_execution_on_train_set_class = model.createResource(annotator.findURI(ontologyJSON, "predictive model execution on train set"));
		predicted_set_role_class = model.createResource(annotator.findURI(ontologyJSON, "predicted set role"));
		predictive_model_test_set_evaluation_calculation_class = model.createResource(annotator.findURI(ontologyJSON, "predictive model test set evaluation calculation"));
		evaluation_measure_calculation_class = model.createResource(annotator.findURI(ontologyJSON, "evaluation measure calculation"));
		predictive_modelling_evaluation_calculation_implementation_class = model.createResource(annotator.findURI(ontologyJSON, "predictive modelling evaluation calculation implementation"));
		evaluation_measure_class = model.createResource(annotator.findURI(ontologyJSON, "evaluation measure"));



		//newly added resources:
		DM_dataset_sampling_class = model.createResource(annotator.findURI(ontologyJSON, "dataset sampling"));
		sampling_technique_class = model.createResource(annotator.findURI(ontologyJSON,"sampling technique"));
			
		// evaluation measure URIs
		addPropertiesEvaluationMeasures(evaluation_measures);

		// cross validation folds URIs
		N_fold_cross_validation_evaluation_workflow_execution_class = model.createResource("http://www.ontodm.com/OntoDM-core/ontoexp_0005"); // findURI can't find it
		N_fold_cross_validation_sampling_process_class = model.createResource(annotator.findURI(ontologyJSON, "N fold cross validation sampling process"));
		set_of_folds_class = model.createResource(annotator.findURI(ontologyJSON, "set of folds"));
		fold_class = model.createResource(annotator.findURI(ontologyJSON, "fold"));
		per_fold_evaluation_workflow_execution_class = model.createResource(annotator.findURI(ontologyJSON, "per fold evaluation workflow execution"));
		CV_train_test_dataset_assignment_class = model.createResource(annotator.findURI(ontologyJSON, "CV train/test dataset assignment"));
		N_fold_evaluation_measure = model.createResource("http://www.ontodm.com/OntoDM-core/ontoexp#N_fold_evaluation_measure"); // can't find it with annotator
		
		// creating URIs for object properties ________________THESE ARE PREDICATES______________?
		precedes = ontModel.createObjectProperty(annotator.findURI(ontologyJSON, "precedes"));
		preceded_by = ontModel.createObjectProperty(annotator.findURI(ontologyJSON, "preceded by"));
		has_part = ontModel.createObjectProperty(annotator.findURI(ontologyJSON, "has part"));
		has_participant = ontModel.createObjectProperty(annotator.findURI(ontologyJSON, "has participant"));
		has_specified_input = ontModel.createObjectProperty(annotator.findURI(ontologyJSON, "has specified input"));
		is_specified_input_of = ontModel.createObjectProperty(annotator.findURI(ontologyJSON, "is specified input of"));
		has_specified_output = ontModel.createObjectProperty(annotator.findURI(ontologyJSON, "has specified output"));
		has_quality = ontModel.createObjectProperty(annotator.findURI(ontologyJSON, "has quality"));
		has_role = ontModel.createObjectProperty(annotator.findURI(ontologyJSON, "has role"));
		is_concretization_of = ontModel.createObjectProperty(annotator.findURI(ontologyJSON, "is concretization of"));
		is_realized_by = ontModel.createObjectProperty(annotator.findURI(ontologyJSON, "is realized by"));
		originates_from = ontModel.createObjectProperty(annotator.findURI(ontologyJSON, "originates from"));
		participates_in = ontModel.createObjectProperty(annotator.findURI(ontologyJSON, "participates in"));
		is_specified_output_of = ontModel.createObjectProperty(annotator.findURI(ontologyJSON, "is specified output of"));
		realizes = ontModel.createObjectProperty(annotator.findURI(ontologyJSON, "realizes"));
		role_of = ontModel.createObjectProperty(annotator.findURI(ontologyJSON, "role of"));
		has_evaluation_measure = ontModel.createObjectProperty("http://www.ontodm.com/OntoDM-core/ontoexp#has_evaluation_measure"); // can't find it with annotator
		has_input = ontModel.createObjectProperty("http://www.ontodm.com/OntoDM-core/ontoexp#has_input");
		
		// creating URIs for data properties
		denoted_by = ontModel.createDatatypeProperty(annotator.findURI(ontologyJSON, "denoted by"));
		has_value = ontModel.createDatatypeProperty(annotator.findURI(ontologyJSON, "has value"));
		number_of_examples = ontModel.createDatatypeProperty(annotator.findURI(ontologyJSON, "number of examples"));
		number_of_folds = ontModel.createDatatypeProperty(annotator.findURI(ontologyJSON, "number of folds"));
		algorithm_name = ontModel.createDatatypeProperty(annotator.findURI(ontologyJSON, "algorithm name"));

		//newly added properties
		is_about = ontModel.createObjectProperty(annotator.findURI(ontologyJSON, "is about"));

		model.add(ontModel);
	}
	
	// evaluation measure URIs
	// Separated function for evaluation measures since values may not appear in the same order in the files
	public void addPropertiesEvaluationMeasures(String[] evaluation_measures)
	{
		for (int i = 0; i < evaluation_measures.length; i++) 
		{
			evaluation_measure_classes[i] = model.createResource(annotator.findURI(ontologyJSON, evaluation_measures[i]));
		}
	}
		
	public void annotateDataExample(String dataExample, Map<String, String> xsd_string_map, String[] evaluation_measures, Boolean isTrainTestSplit) {

		// line of data gets split into an array
		String[] dataExampleArrayWithFirst = dataExample.split(",");
		String[] dataExampleArray = new String[dataExampleArrayWithFirst.length-1];


		for (int i = 1; i < dataExampleArrayWithFirst.length; i++)
		{
			dataExampleArray[i-1] = dataExampleArrayWithFirst[i];  //a bit of reordering (the first spot is just the line index aka not needed)
		}

		// for trainTest.csv
		// dataExampleArray[0] --> data set name
		// dataExampleArray[1] --> method name
		
		// for folds.scv
		// dataExampleArray[0] --> data set name
		// dataExampleArray[1] --> method name / algorithm name
		// dataExampleArray[2] --> parameters
		// dataExampleArray[3] --> fold
		
		String identifier_str = "";
		String identifier_str_xsd = "";
		
		Resource[] evaluation_measure_calculation_instances;
		Resource[] predictive_modelling_evaluation_calculation_implementation_instances;
		Resource[] evaluation_measure_instances;
		
		if(isTrainTestSplit){ //when we are dealing with training data
			identifier_str = dataExampleArray[0]+"_"+dataExampleArray[1];
			identifier_str_xsd = dataExampleArray[0]+"-"+dataExampleArray[1];
			
			evaluation_measure_calculation_instances = new Resource[20];
			predictive_modelling_evaluation_calculation_implementation_instances = new Resource[20];
			evaluation_measure_instances = new Resource[20];
		}
		else {
			identifier_str = dataExampleArray[0]+"_"+dataExampleArray[1]+"_"+dataExampleArray[2]+"_"+dataExampleArray[3];
			identifier_str_xsd = dataExampleArray[0]+"-"+dataExampleArray[1]+"-"+dataExampleArray[2]+"-"+dataExampleArray[3];
			
			evaluation_measure_calculation_instances = new Resource[18];
			predictive_modelling_evaluation_calculation_implementation_instances = new Resource[18];
			evaluation_measure_instances = new Resource[18];
		}

		//creating "personalized" resources (instances only available inside the method but the data is stores at the end of the method)
		Resource dataset_instance = annotator.createResource(DM_dataset_class, dataExampleArray[0]+".arff");
		Resource dataset_train_instance = annotator.createResource(DM_dataset_class, dataExampleArray[0]+"_train.arff");
		Resource dataset_test_instance = annotator.createResource(DM_dataset_class, dataExampleArray[0]+"_test.arff");
		Resource dataset_test_role_instance = annotator.createResource(test_set_role_class, dataExampleArray[0]+"_dataset_test_role");
		Resource dataset_train_role_instance = annotator.createResource(train_set_role_class, dataExampleArray[0]+"_dataset_train_role");			
		Resource dataset_predicted_instance = annotator.createResource(DM_dataset_class, identifier_str+"_predicted.arff");
		
		Resource predicted_set_role_instance = annotator.createResource(predicted_set_role_class, identifier_str+"_predicted_set_role");	
		Resource train_test_dataset_assignment_instance = annotator.createResource(train_test_dataset_assignment_class, identifier_str+"_train_test_dataset_assignment");
		Resource predictive_model_train_test_evaluation_workflow_execution_instance = annotator.createResource(predictive_model_train_test_evaluation_workflow_execution_class, identifier_str+"_predictive_model_train_test_evaluation_workflow_execution");
		Resource predictive_model_train_test_evaluation_workflow_implementation_instance = annotator.createResource(predictive_model_train_test_evaluation_workflow_implementation_class, identifier_str+"_predictive_model_train_test_evaluation_workflow_implementation");
		Resource predictive_modelling_algorithm_execution_instance = annotator.createResource(predictive_modelling_algorithm_execution_class, identifier_str+"_predictive_modelling_algorithm_execution"); 
		Resource predictive_modelling_algorithm_implementation_instance = annotator.createResource(predictive_modelling_algorithm_implementation_class, identifier_str+"_predictive_modelling_algorithm_implementation");
		Resource predictive_model_instance = annotator.createResource(predictive_model_class, identifier_str+"_predictive_model");
		Resource predictive_model_execution_on_test_set_instance = annotator.createResource(predictive_model_execution_on_test_set_class, identifier_str+"_predictive_model_execution_on_test_set");
		Resource predictive_model_test_set_evaluation_calculation_instance = annotator.createResource(predictive_model_test_set_evaluation_calculation_class, identifier_str+"_predictive_model_test_set_evaluation_calculation");


		//sampled (stratified) data
		Resource dataset_sampled_train_instance = annotator.createResource(DM_dataset_class,dataExampleArray[0]+"_1000_sampled_train.arff"); //new instance for sampled/stratified train data
		//originates property
		dataset_sampled_train_instance.addProperty(originates_from,dataset_train_instance);


		//create the DM data sampling instance
		Resource stratified_sampling_instance = annotator.createResource(DM_dataset_sampling_class, dataExampleArray[0]+"_train_1000_stratified_sampling");

		//add from sampling to the whole train set (2X)
		stratified_sampling_instance.addProperty(has_specified_input,dataset_train_instance);
		dataset_train_instance.addProperty(is_specified_input_of,stratified_sampling_instance);

		//add from sampling to the sampled train set (2X)
		stratified_sampling_instance.addProperty(has_specified_output,dataset_sampled_train_instance);
		dataset_sampled_train_instance.addProperty(is_specified_output_of,stratified_sampling_instance);

		//create instance of sampling tecnique
		Resource sampling_technique_instance = annotator.createResource(sampling_technique_class, "MLC iterative stratified sampling technique");

		//connect sampling instance with DM dataset sampling via 'is_about'
		sampling_technique_instance.addProperty(is_about,stratified_sampling_instance);

		// evaluation measure instances
//		Resource[] evaluation_measure_calculation_instances = new Resource[20];
//		Resource[] predictive_modelling_evaluation_calculation_implementation_instances = new Resource[20];
//		Resource[] evaluation_measure_instances = new Resource[20];

		for (int i = 0; i < evaluation_measures.length; i++)
		{

			evaluation_measure_calculation_instances[i] = annotator.createResource(evaluation_measure_classes[i], identifier_str+"_"+evaluation_measures[i]+"_evaluation_measure_calculation");
			predictive_modelling_evaluation_calculation_implementation_instances[i] = annotator.createResource(evaluation_measure_classes[i], identifier_str+"_"+evaluation_measures[i]+"_predictive_modelling_evaluation_calculation_implementation");
			evaluation_measure_instances[i] = annotator.createResource(evaluation_measure_classes[i], identifier_str+"_"+evaluation_measures[i]+"_evaluation_measure");


		}
		
		// adding properties
		// train_test_dataset_assigment properties
		train_test_dataset_assignment_instance.addProperty(has_specified_input, dataset_instance);
		train_test_dataset_assignment_instance.addProperty(has_specified_output, dataset_train_instance);
		train_test_dataset_assignment_instance.addProperty(has_specified_output, dataset_test_instance);
		train_test_dataset_assignment_instance.addProperty(precedes, predictive_model_train_test_evaluation_workflow_execution_instance);
		
		// dataset_train / _test properties
		dataset_train_instance.addProperty(originates_from, dataset_instance);
		dataset_train_instance.addProperty(has_role, dataset_train_role_instance);
		dataset_test_instance.addProperty(originates_from, dataset_instance);
		dataset_test_instance.addProperty(has_role, dataset_test_role_instance);
		
		// dataset_train / _test role properties
		dataset_train_role_instance.addProperty(is_realized_by, train_test_dataset_assignment_instance);
		dataset_test_role_instance.addProperty(is_realized_by, train_test_dataset_assignment_instance);
		
		// predictive_model_train/test_evaluation_workflow_execution properties
		predictive_model_train_test_evaluation_workflow_execution_instance.addProperty(preceded_by, train_test_dataset_assignment_instance);
		predictive_model_train_test_evaluation_workflow_execution_instance.addProperty(realizes, predictive_model_train_test_evaluation_workflow_implementation_instance);
		predictive_model_train_test_evaluation_workflow_execution_instance.addProperty(has_part, predictive_modelling_algorithm_execution_instance);
		predictive_model_train_test_evaluation_workflow_execution_instance.addProperty(has_part, predictive_model_execution_on_test_set_instance);
		predictive_model_train_test_evaluation_workflow_execution_instance.addProperty(has_part, predictive_model_test_set_evaluation_calculation_instance);
		
		// predictive_modelling_algorithm_execution properties
		predictive_modelling_algorithm_execution_instance.addProperty(realizes, predictive_modelling_algorithm_implementation_instance);
		predictive_modelling_algorithm_execution_instance.addProperty(has_specified_output, predictive_model_instance);
		predictive_modelling_algorithm_execution_instance.addProperty(precedes, predictive_model_execution_on_test_set_instance);
		predictive_modelling_algorithm_execution_instance.addProperty(algorithm_name, dataExampleArray[1]);
		
		// predictive_model properties
		if (xsd_string_map.get(identifier_str_xsd) != null)
		{
			predictive_model_instance.addProperty(denoted_by, xsd_string_map.get(identifier_str_xsd));
		}
		else 
		{
			predictive_model_instance.addProperty(denoted_by, "Missing model_parameters.");
		}
		
		// predictive_model_execution_on_test_set properties
		predictive_model_execution_on_test_set_instance.addProperty(has_specified_output, dataset_predicted_instance);
		predictive_model_execution_on_test_set_instance.addProperty(has_specified_input, dataset_test_instance);
		predictive_model_execution_on_test_set_instance.addProperty(precedes, predictive_model_test_set_evaluation_calculation_instance);
		
		// dataset_predicted properties
		dataset_predicted_instance.addProperty(has_role, predicted_set_role_instance);
		dataset_predicted_instance.addProperty(originates_from, dataset_test_instance);
		
		// predictive_model_test_set_evaluation_calculation property
		predictive_model_test_set_evaluation_calculation_instance.addProperty(has_specified_input, dataset_test_instance);

		for (int i = 0; i < evaluation_measures.length; i++)
		{
			// predictive_model_test_set_evaluation_calculation property
			predictive_model_test_set_evaluation_calculation_instance.addProperty(has_part, evaluation_measure_calculation_instances[i]);
			
			// evaluation_measure_calculation property
			evaluation_measure_calculation_instances[i].addProperty(realizes, predictive_modelling_evaluation_calculation_implementation_instances[i]);
			
			// predictive_modelling_evaluation_calculation_implementation property
			predictive_modelling_evaluation_calculation_implementation_instances[i].addProperty(is_concretization_of, evaluation_measure_instances[i]);
		
			// evaluation_measure property
			if (isTrainTestSplit)
			{
				evaluation_measure_instances[i].addLiteral(has_value, dataExampleArray[i+2]);
			}
			else
			{
				evaluation_measure_instances[i].addLiteral(has_value, dataExampleArray[i+4]);
			}
		}
		
		if (!isTrainTestSplit)
		{
			// get other two folds
			String otherFolds = "123".replaceAll(dataExampleArray[3], "");
			otherFolds = otherFolds.charAt(0) + "_" + otherFolds.substring(1);
			
			// upper level instances and properties
			//cross validation fold instances
			Resource N_fold_cross_validation_evaluation_workflow_execution_instance = annotator.createResource(N_fold_cross_validation_evaluation_workflow_execution_class, dataExampleArray[0]+"_"+dataExampleArray[1]+"_"+dataExampleArray[2]+"_3_fold_cross_validation_evaluation_workflow_execution");
			Resource N_fold_cross_validation_sampling_process_instance = annotator.createResource(N_fold_cross_validation_sampling_process_class, dataExampleArray[0]+"_3_fold_cross_validation_sampling_process");
			Resource dataset_folds_1_2_3_instance = annotator.createResource(set_of_folds_class, dataExampleArray[0]+"_folds_1_2_3");
			Resource dataset_fold_1_instance = annotator.createResource(fold_class, dataExampleArray[0]+"_fold_1.arff");
			Resource dataset_fold_2_instance = annotator.createResource(fold_class, dataExampleArray[0]+"_fold_2.arff");
			Resource dataset_fold_3_instance = annotator.createResource(fold_class, dataExampleArray[0]+"_fold_3.arff");
			Resource per_fold_evaluation_workflow_execution_instance = annotator.createResource(per_fold_evaluation_workflow_execution_class, identifier_str+"_fold_test_evaluation_workflow_execution");
			Resource dataset_1_test_2_train_dataset_assignment_instance = annotator.createResource(CV_train_test_dataset_assignment_class, dataExampleArray[0]+"_"+dataExampleArray[3]+"_fold_test_"+otherFolds+"_fold_train_dataset_assignment");
			Resource dataset_fold_test_instance = annotator.createResource(DM_dataset_class, dataExampleArray[0]+"_fold_"+dataExampleArray[3]+"_test.arff");
			Resource dataset_fold_test_set_role_instance = annotator.createResource(test_set_role_class, dataExampleArray[0]+"_fold_"+dataExampleArray[3]+"_test_set_role");
			Resource dataset_fold_train_instance = annotator.createResource(DM_dataset_class, dataExampleArray[0]+"_fold_"+otherFolds+"_train.arff");
			Resource dataset_fold_train_set_role_instance = annotator.createResource(train_set_role_class, dataExampleArray[0]+"_fold_"+otherFolds+"_train_set_role");
			Resource[] N_fold_evaluation_measure_instances = new Resource[18];
			
			if (dataExampleArray[3].equals("3"))
			{
				for (int i = 0; i < evaluation_measures.length; i++)
				{
					N_fold_evaluation_measure_instances[i] = annotator.createResource(N_fold_evaluation_measure, dataExampleArray[0]+"_"+dataExampleArray[1]+"_"+dataExampleArray[2]+"_3_fold_"+evaluation_measures[i]+"_evaluation_measure");
					
					
					Resource fold1 = annotator.getResourceFromModel(model, dataExampleArray[0]+"_"+dataExampleArray[1]+"_"+dataExampleArray[2]+"_1_"+evaluation_measures[i]+"_evaluation_measure");
					Resource fold2 = annotator.getResourceFromModel(model, dataExampleArray[0]+"_"+dataExampleArray[1]+"_"+dataExampleArray[2]+"_2_"+evaluation_measures[i]+"_evaluation_measure");
					Resource fold3 = annotator.getResourceFromModel(model, dataExampleArray[0]+"_"+dataExampleArray[1]+"_"+dataExampleArray[2]+"_3_"+evaluation_measures[i]+"_evaluation_measure");
					
					// has value property
					fold1.addProperty(has_input, N_fold_evaluation_measure_instances[i]);
					fold2.addProperty(has_input, N_fold_evaluation_measure_instances[i]);
					fold3.addProperty(has_input, N_fold_evaluation_measure_instances[i]);
					
					// get mean
					double mean = 0;
					double value1 = 0;
					double value2 = 0;
					double value3 = 0;
					
					try {
						value1 = model.getProperty(fold1, has_value).getDouble();
						value2 = model.getProperty(fold2, has_value).getDouble();
						value3 = model.getProperty(fold3, has_value).getDouble();
						mean = (value1 + value2 + value3) / 3;
						
					}
					catch(Exception e) {}
					
					N_fold_evaluation_measure_instances[i].addLiteral(has_value, Double.toString(mean));
				}					
			}
			
			// cross validation properties
			// N_fold_cross_validation_evaluation_workflow_execution_properties
			N_fold_cross_validation_evaluation_workflow_execution_instance.addProperty(has_part, N_fold_cross_validation_sampling_process_instance);
			N_fold_cross_validation_evaluation_workflow_execution_instance.addProperty(has_part, per_fold_evaluation_workflow_execution_instance);
			
			// N_fold_cross_validation_sampling process
			N_fold_cross_validation_sampling_process_instance.addProperty(has_specified_input, dataset_train_instance);
			N_fold_cross_validation_sampling_process_instance.addProperty(has_specified_output, dataset_folds_1_2_3_instance);
				
			// dataset_folds_1_2_3 properties
			dataset_folds_1_2_3_instance.addProperty(has_part, dataset_fold_1_instance);
			dataset_folds_1_2_3_instance.addProperty(has_part, dataset_fold_2_instance);
			dataset_folds_1_2_3_instance.addProperty(has_part, dataset_fold_3_instance);
						
			// dataset_folds 1, 2, 3 properties
			dataset_fold_1_instance.addProperty(originates_from, dataset_train_instance);
			dataset_fold_2_instance.addProperty(originates_from, dataset_train_instance);
			dataset_fold_3_instance.addProperty(originates_from, dataset_train_instance);
					
			// per_fold_test_evaluation_workflow_execution property
			per_fold_evaluation_workflow_execution_instance.addProperty(has_part, dataset_1_test_2_train_dataset_assignment_instance);
				
			// dataset_1_test_2_train_dataset_assignment properties
			dataset_1_test_2_train_dataset_assignment_instance.addProperty(has_specified_output, dataset_fold_test_instance);
			dataset_1_test_2_train_dataset_assignment_instance.addProperty(has_specified_output, dataset_fold_train_instance);
			dataset_1_test_2_train_dataset_assignment_instance.addProperty(precedes, predictive_model_train_test_evaluation_workflow_execution_instance);
						
			// dataset_fold_train / _test properties
			dataset_fold_test_instance.addProperty(has_role, dataset_fold_test_set_role_instance);
			dataset_fold_train_instance.addProperty(has_role, dataset_fold_train_set_role_instance);
		}
	}
	
	// reads the JSON file and returns a map, key: identifier, value: model_parameters
	public static Map<String, String> getModelParametersMap(String path)
	{
		JSONParser jsonP = new JSONParser();
		JSONArray xsd_string_list = new JSONArray();
		Map<String, String> xsd_map = new HashMap<String, String>();
		
		try (FileReader jsonReader = new FileReader(path))
		{
			Object jsonObj = jsonP.parse(jsonReader);
			xsd_string_list = (JSONArray) jsonObj;
			xsd_string_list.toArray();
			//go through the objects
			for (int i = 0; i < xsd_string_list.size(); i++)
			{
				String str = xsd_string_list.get(i).toString();
				String[] twoStr = str.split(",", 2);
				xsd_map.put(twoStr[0].substring(15, twoStr[0].length()-1), twoStr[1].substring(0, twoStr[1].length()-1));
			}
		}
		catch (Exception e)
		{
			System.out.println("no go");
		}
		
		return xsd_map;
	}
	
	public static void main(String[] args) throws JsonIOException, JsonSyntaxException, IOException
	{
		String path = "C:\\Users\\grabn\\Desktop\\23.12.2021\\";  //path to the data folder
		Object owlObj = new JsonParser().parse(new FileReader(path+"ontoexpJSON.owl"));
		JsonArray ontoexpOntology = (JsonArray) owlObj;

		AnnotateMLCdata annotations = new AnnotateMLCdata(ontoexpOntology);
		
		// read JSON models
		Map<String, String> xsd_map_trainTest = getModelParametersMap(path+"trainTestModels.json");
		Map<String, String> xsd_map_fold = getModelParametersMap(path+"foldsModels.json");
		
		// read train test.csv
		Scanner csvReaderTrainTest = new Scanner(new File(path+"trainTest.csv"));  //scanner that will read the trainTest file
		csvReaderTrainTest.useDelimiter(",");  //make "," the delimiter
 		String[] evaluation_measures = csvReaderTrainTest.nextLine().substring(16).split(","); // substring is for removing the first two words, which are not needed
		//(up) make an array of values/strings to get the names of the columns
		
		annotations.addProperties(evaluation_measures); //add names of the properties to the anotations
		int i = 0;
		/*
		while (csvReaderTrainTest.hasNext())
		{
			annotations.annotateDataExample(csvReaderTrainTest.nextLine(), xsd_map_trainTest, evaluation_measures, true);  //input parameters: the line of data, the map, the names of the columns of csv file, boolean for checking if data is train data
			i++;
			//if(i>1) break;
		}
		csvReaderTrainTest.close(); //close the reader

		System.out.print("Train/test model size: ");
		System.out.println(annotations.model.size());
		PrintStream bw = new PrintStream(path+"MLCExperimentTrainTestAnnotations.rdf");
		RDFDataMgr.write(bw, annotations.model, RDFFormat.RDFXML);
		bw.close();
		System.out.println("Train/Test done");*/



		//folds rdf part
		//read folds.csv
		Scanner csvReaderFold = new Scanner(new File(path+"folds.csv"));
		csvReaderFold.useDelimiter(",");
		String[] evaluation_measures_fold = csvReaderFold.nextLine().substring(32).split(","); // substring is for removing the first four words
		annotations.addPropertiesEvaluationMeasures(evaluation_measures_fold);
		int number_of_lines_in_CV_table = 75479;
		int max_CV_annotations_part_size = 7503; //!!this should be divisible by 3(number of folds)!!


		for(int part = 0;csvReaderFold.hasNext();part++) {

			AnnotateMLCdata annotations_cv_part = new AnnotateMLCdata(ontoexpOntology);
			annotations_cv_part.addProperties(evaluation_measures);


			int part_line_counter = 0;
			for(int k = 0;csvReaderFold.hasNext()&&k<max_CV_annotations_part_size;k++)
			{
				System.out.println("iter: " + k);
				String lmao = csvReaderFold.nextLine();
				//System.out.println(lmao);
				annotations_cv_part.annotateDataExample(lmao, xsd_map_fold, evaluation_measures_fold, false);
				part_line_counter++;
			}
			System.out.printf("Number of lines annotated in %d iteration: %d\n",part,part_line_counter);
			System.out.println("_______________________________");

			System.out.print("MLCExperimentDataAnnotationsSmall"+part+".rdf model size: ");
			System.out.println(annotations_cv_part.model.size());
			PrintStream bw1 = new PrintStream(path+"MLCExperimentDataAnnotationsSmall"+part+".rdf");
			System.out.println("Middle1");
			RDFDataMgr.write(bw1, annotations_cv_part.model, RDFFormat.RDFXML);
			System.out.println("Middle2");
			bw1.close();


		}

		csvReaderFold.close();

		// save the model in RDF file
		/*
		System.out.print("model size: ");
		System.out.println(annotations.model.size());
		PrintStream bw1 = new PrintStream(path+"MLCExperimentDataAnnotationsSmall1.rdf");
		System.out.println("Middle1");
		RDFDataMgr.write(bw1, annotations.model, RDFFormat.RDFXML);
		System.out.println("Middle2");
		bw1.close();
		 */
		System.out.println("Done");






	}
}


/*
System.out.printf("\r");
					for (int e = 0; e < i/10000; e++) {

						System.out.print("*");

					}
					for (int e = 0; e < 10-(i/10000); e++) {

						System.out.print(" ");

					}

					System.out.printf("|%d out of %d",i/10000,5);
 */