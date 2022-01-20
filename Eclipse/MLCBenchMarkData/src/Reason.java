
import java.io.FileNotFoundException;
import java.io.PrintStream;

import org.apache.jena.rdf.model.InfModel;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.reasoner.Reasoner;
import org.apache.jena.reasoner.ReasonerRegistry;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.riot.RDFFormat;
//import org.apache.jena.util.FileManager;

public class Reason {
	

	public static void main(String[] args) throws FileNotFoundException {
		Model schema = RDFDataMgr.loadModel("C:\\Users\\Ajax\\Desktop\\Praksa\\MLC\\ontoexp.owl") ;
//		Model data = FileManager.get().loadModel("C:\\Users\\ana\\Google Drive\\bookChapter\\TripleStore\\AnnotationsMLCNotSparse.rdf");
		Reasoner reasoner = ReasonerRegistry.getOWLMicroReasoner();
		reasoner = reasoner.bindSchema(schema);
		System.out.println("Finished reasoning");
		InfModel infmodel = ModelFactory.createInfModel(reasoner, schema);
		System.out.println("Writing inferred model..");
		PrintStream bw = new PrintStream("C:\\Users\\Ajax\\Desktop\\Praksa\\MLC\\ontoexpInfered.owl");
		RDFDataMgr.write(bw, infmodel, RDFFormat.RDFXML);
		System.out.println("done");
	}

}