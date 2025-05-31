import { Component, OnInit } from '@angular/core';
import {RealEstateService} from '../../../../services/real-estate/real-estate.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ChatService} from '../../../../services/chat/chat.service';

@Component({
  selector: 'app-request-uebersicht',
  templateUrl: './request-uebersicht.component.html',
  styleUrls: ['./request-uebersicht.component.css'],
  standalone: true,
  imports: [CommonModule]
})

/**
 * @class RequestUebersichtComponent
 * @remarks
 * Displays an overview of requests submitted by the user.
 */
export class RequestUebersichtComponent implements OnInit {
  requests: any[] = [];  // Array zum Speichern der Requests

  constructor(
    private realEstateService: RealEstateService,
    private route: ActivatedRoute,
    private router: Router,
    private readonly chatService: ChatService
  ) {
  }

  /**
   * @method ngOnInit (RequestUebersichtComponent)
   * @remarks
   * Initializes the component and loads the user's requests.
   */
  ngOnInit() {
    this.loadRequest();  // Lädt die Anfragen bei der Initialisierung der Seite
  }

  /**
   * @method loadRequest (RequestUebersichtComponent)
   * @remarks
   * Retrieves all requests submitted by the current user from the service.
   */
  // Beispiel: In der Komponente (RequestUebersichtComponent)
  loadRequest() {
    this.realEstateService.getAllRequestsByRequester().subscribe(
      (requests) => {
        this.requests = requests; // Hier erhältst du ein Array
      },
      (error) => {
        console.error('Fehler beim Laden der Requests:', error);
      }
    );
  }

  /**
   * @method viewChatConversation (RequestUebersichtComponent)
   * @remarks
   * Navigates to the chat conversation associated with the selected request.
   */
  viewChatConversation(request: any): void {
    // 1) request_id aus dem Objekt holen
    const requestId = request.request_id;
    console.log("Die Id ist:" + requestId);
    this.router.navigate(['/chat', requestId]);
    this.chatService.createConversation(requestId).subscribe(
      (createdConversation) => {
        // Erfolgreich: Jetzt kannst du z.B. zur Chat-Seite navigieren
      },
      (error) => {
        console.error('Fehler beim Erstellen der Conversation:', error);
      }
    );




  }

}
