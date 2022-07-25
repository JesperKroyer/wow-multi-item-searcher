import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import axios from 'axios';
import Nexus from 'nexushub-client';
import { ItemPriceResult } from './interfaces/itemPriceResult.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  public authBaseUrl = 'https://auth.nexushub.co';
  //https://api.nexushub.co/wow-classic/v1/items/pyrewood-village-alliance
  public wowBaseUrl = 'https://api.nexushub.co/wow-classic/v1/items/';
  public accessToken = '';
  public resultList: ItemPriceResult[] = [];
  public totalCosts: number = 0;
  public totalLastWeek: number = 0;
  public totalCostsChange: number = 0;
  public activated: boolean = false;
  public factions = [{ value: 'Alliance' }, { value: 'Horde' }];
  public realmAndFaction = new FormGroup({
    realm: new FormControl(''),
    faction: new FormControl('Alliance'),
  });
  public advancedSettings = false;

  title = 'wow-multi-item-searcher';

  public placeHolderText = '100x Rough Stone \n' +
    '190x Copper Bar \n' +
    '20x Coarse Stone \n' +
    '5x Silver Bar \n' +
    '120x Bronze Bar \n' +
    '75x Heavy Stone \n' +
    '5x Gold Bar \n' +
    '230x Iron Bar \n' +
    '35x Green Dye \n' +
    '50x Steel Bar \n' +
    '5x Truesilver Bar \n' +
    '60x Solid Stone \n' +
    '320x Mithril Bar \n' +
    '150x Mageweave Cloth \n' +
    '30x Dense Stone \n' +
    '430x Thorium Bar \n' +
    '15x Arcanite Bar \n' +
    '80x Rugged Leather';

  public itemList = "";


  public constructor(
  ) {

  }
  public async Calculate() {
    this.resultList = [];
    this.totalCosts = 0;
    this.totalLastWeek = 0;
    this.totalCostsChange = 0;
    let splitString = this.itemList.split('\n');
    for (let index = 0; index < splitString.length; index++) {
      const element = splitString[index].trim();
      const splitElement = [element.substring(0, element.indexOf('x')), element.substring(element.indexOf('x') + 1)]
      console.log(splitElement)
      if (index % 20 === 0 && index > 0) {
        await this.Delay(5000);
        await this.GetItemPrice(splitElement[0], splitElement[1])
      } else {
        await this.GetItemPrice(splitElement[0], splitElement[1])
      }
    }
    this.activated = true;
    this.itemList = '';
  }

  public async GetItemPrice(amount: string, item: string) {
    let realm = 'pyrewood-village';
    if (this.realmAndFaction.get('realm').value) {
      realm = this.realmAndFaction.get('realm').value.trim().split(' ').join('-').toLowerCase();
    }
    if (item) {
      axios.get<ItemPriceResult>(
        this.wowBaseUrl + realm + '-' +
        this.realmAndFaction.get('faction').value.trim().toLowerCase() +
        '/' +
        item.trim().split(' ').join('-') + '/prices').then((res) => {
          if (res.data.data) {
            res.data.data[0].originalMarkValue = res.data.data[0].marketValue;
            res.data.quantity = +amount;
            res.data.data[0].marketValue = res.data.data[0].marketValue * Number(amount);
            res.data.data[res.data.data.length - 1].originalMarkValue = res.data.data[res.data.data.length - 1].marketValue;
            res.data.data[res.data.data.length - 1].marketValue = res.data.data[res.data.data.length - 1].marketValue * Number(amount);
            this.TotalCosts(res.data)
            this.resultList.push(res.data)
          }
        })
    }
  }

  public Delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public TotalCosts(result: ItemPriceResult) {
    this.totalCosts += result.data[result.data.length - 1].marketValue;
    this.totalLastWeek += result.data[0].marketValue;
    this.totalCostsChange = this.totalCosts - this.totalLastWeek;
  }
}
