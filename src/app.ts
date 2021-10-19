interface Validatable{
  value:string|number;//a string or number is acceptable
  required?:Boolean;/*the question mark represents a boolean or undefined*/ 
  minLength?:number;
  maxLength?:number;
  min?: number;
  max?: number;
}

function validate(ValidatableInput:Validatable)
{
  let isValid=true;
  if(ValidatableInput.required){

    isValid=isValid && ValidatableInput.value.toString().trim().length !==0;
  }

  if(ValidatableInput.minLength !=null && typeof ValidatableInput.value ==='string'){
    isValid=isValid && ValidatableInput.value.length>ValidatableInput.minLength;
  }

  if(ValidatableInput.maxLength !=null && typeof ValidatableInput.value ==='string'){
    isValid=isValid && ValidatableInput.value.length<ValidatableInput.maxLength;
  }  

  if (
    ValidatableInput.min != null &&
    typeof ValidatableInput.value === 'number'
  ) {
    isValid = isValid && ValidatableInput.value >= ValidatableInput.min;
  }

  if (
    ValidatableInput.max != null &&
    typeof ValidatableInput.value === 'number'
  ) {
    isValid = isValid && ValidatableInput.value <= ValidatableInput.max;
  }

  return isValid;
}

//rendering projectlist class
class ProjectList{

  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;//the host element will be a div
  element: HTMLElement;
  
  constructor(private type: 'active' | 'finished'){
    this.templateElement = document.getElementById(
      'project-list'
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;
    //we import our content
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLFormElement;//store the first element of the imported template,we store in the property element
    this.element.id = `${this.type}-projects`;
    this.attach();//attaching our created element to the dom
    this.renderContent();
  }

  private renderContent(){
    const listId=`${this.type}-projects-list`;
    this.element.querySelector('ul')!.id=listId;
    this.element.querySelector('h2')!.textContent=this.type.toUpperCase()+'Projects';    
  }

  private attach(){
    this.hostElement.insertAdjacentElement('beforeend', this.element);
  }

}



// ProjectInput Class
  class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;
  
    constructor() {
      this.templateElement = document.getElementById(
        'project-input'
      )! as HTMLTemplateElement;
      this.hostElement = document.getElementById('app')! as HTMLDivElement;
  
      const importedNode = document.importNode(
        this.templateElement.content,
        true
      );
      this.element = importedNode.firstElementChild as HTMLFormElement;
      this.element.id = 'user-input';
  
      this.titleInputElement = this.element.querySelector(
        '#title'
      ) as HTMLInputElement;
      this.descriptionInputElement = this.element.querySelector(
        '#description'
      ) as HTMLInputElement;
      this.peopleInputElement = this.element.querySelector(
        '#people'
      ) as HTMLInputElement;
  
      this.configure();
      this.attach();
    }
  

    private gatherUserInput():[string,string,number] | void {

      const enteredTitle=this.titleInputElement.value;
      const enteredDescription=this.descriptionInputElement.value;
      const enteredPeople=this.peopleInputElement.value;

      const titleValidatable:Validatable={
        value:enteredTitle,
        required:true
      };

      const descriptionValidatable:Validatable={
        value:enteredDescription,
        required:true, 
        minLength:5
      };

      const peopleValidatable:Validatable={
        value:+enteredPeople,
        required:true,
        min: 1,
        max: 5
      };


      if (
        !validate(titleValidatable) ||
        !validate(descriptionValidatable) ||
        !validate(peopleValidatable)
      ) {
        alert('Invalid input, please try again!');
        return;
      } else {
        return [enteredTitle, enteredDescription, +enteredPeople];
      }
     
    }
    
    private submitHandler(event: Event) {
      event.preventDefault();
      const userInput=this.gatherUserInput();
      console.log(this.titleInputElement.value);
      
      if(Array.isArray(userInput))
      {
        const [title,desc,people]=userInput;
        console.log(title+desc+people);
        this.clearInputs();
      }

    }

    private clearInputs(){
      this.titleInputElement.value='';
      this.descriptionInputElement.value='';
      this.peopleInputElement.value='';
    }


  
    private configure() {
      this.element.addEventListener('submit', this.submitHandler.bind(this));
    }
  
    private attach() {
      this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
  }
  
  const prjInput = new ProjectInput();
  const activePrjList=new ProjectList('active');
  const finishPrjList=new ProjectList('finished');