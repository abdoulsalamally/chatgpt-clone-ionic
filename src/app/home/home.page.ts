import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message } from '../models/messages.model';
import axios from 'axios'
import { IonContent } from '@ionic/angular';
import { CustomValidators } from '../utils/custom.validators';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonContent, {static: false}) content!: IonContent;

  messages: Message[] = [];

  form = new FormGroup({
    prompt: new FormControl('', (Validators.required, CustomValidators.noWhiteSpace))
  })

  loading: boolean =false;
  constructor() {}

  submit(){

    if(this.form.valid){
      let prompt = this.form.value.prompt as string;

      let userMsg: Message = { sender: 'me', content: prompt}
      this.messages.push(userMsg);
  
      let botMsg: Message = { sender: 'bot', content: ''}
      this.messages.push(botMsg);
  
      this.scrollToBottom();
      this.form.reset();
      this.form.disable();
      this.loading = true;
  
      const config = {
        headers:{
          'Content-Type':'application/json',
          'Authorization':'Bearer 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'
        }
      }
  
      axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
        prompt: prompt,
        temperature:0.5,
        max_tokens:1000
      }, config)
      .then((response)=>{
        console.log(response);
        this.typeText(response.data.choices[0].text);
        this.form.enable();
        this.loading = false;
      })
      .catch((error) =>{
        console.log(error);
      });
  
    }

   
   
     
  }

  typeText(text:string){
    let textIndex = 0;
    let messagesLastIndex = this.messages.length - 1;

    let interval = setInterval(() => {
      if(textIndex < text.length){
        this.messages[messagesLastIndex].content += text.charAt(textIndex);
        textIndex++;
      }
      else
      { 
        clearInterval(interval);
        this.scrollToBottom();
      }
    }, 15)
  }

  scrollToBottom(){
    this.content.scrollToBottom(2000);
  }

}
