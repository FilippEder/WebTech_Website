import { Component, OnInit } from '@angular/core';
import {RealEstateService} from '../../../../services/real-estate/real-estate.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ChatService} from '../../../../services/chat/chat.service';

@Component({
  selector: 'app-request-overview-owner',
  templateUrl: './request-overview-owner.component.html',
  styleUrls: ['./request-overview-owner.component.css'],
  standalone: true,
  imports: [CommonModule]
})
/**
 * @class RequestOverviewComponentOwner
 * @remarks
 * Provides an overview of requests associated with a property owner.
 */
export class RequestOverviewComponentOwner implements OnInit {
  requests: any[] = [];  // Array zum Speichern der Requests

  constructor(
    private readonly realEstateService: RealEstateService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly chatService: ChatService
  ) {}
  /**
   * @method ngOnInit (RequestOverviewComponentOwner)
   * @remarks
   * Initializes the component and loads the owner’s requests.
   */


  ngOnInit() {
    this.loadRequest();  // Lädt die Anfragen bei der Initialisierung der Seite
  }
  /**
   * @method loadRequest (RequestOverviewComponentOwner)
   * @remarks
   * Retrieves all requests for the owner from the real estate service.
   */
  // Beispiel: In der Komponente (RequestUebersichtComponent)
  loadRequest() {
      this.realEstateService.getAllListingsByOwner().subscribe(
        (requests) => {
          this.requests = requests; // Hier erhältst du ein Array
        },
        (error) => {
          console.error('Fehler beim Laden der Requests:', error);
        }
      );
  }

  /**
   * @method viewChatConversation (RequestOverviewComponentOwner)
   * @remarks
   * Navigates to the chat conversation view for the selected request.
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
